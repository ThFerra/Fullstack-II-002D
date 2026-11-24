// @vitest-environment jsdom
// Pruebas de restricción por rol y del panel administrador conectado a productos-service
import { afterEach, expect, test } from "vitest";
import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";

import { escribir, iniciarSesion, prepararBackend, renderApp } from "./helpers";
import { sesionStore } from "../api/session";

afterEach(() => {
    cleanup();
});

// 19
test("si la sesión del ADMIN termina, el panel queda bloqueado", async () => {
    prepararBackend();
    renderApp();
    iniciarSesion("admin@losmaestros.cl", "Admin123");
    expect(await screen.findByRole("heading", { name: "Panel administrador" })).toBeTruthy();

    act(() => sesionStore.limpiar());

    expect(screen.getByRole("heading", { name: "Panel solo para administradores" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Panel administrador" })).toBeNull();
    expect(within(screen.getByRole("navigation")).queryByRole("button", { name: "Panel Admin" })).toBeNull();
});

// 20
test("el ADMIN crea un producto y se envía a la API con su token", async () => {
    const backend = prepararBackend();
    renderApp();
    iniciarSesion("admin@losmaestros.cl", "Admin123");
    await screen.findByRole("option", { name: "Herramientas manuales" });

    const encabezado = screen.getByRole("heading", { name: "Gestión de productos" });
    const productos = within(encabezado.parentElement as HTMLElement);
    escribir(productos.getByLabelText("Nombre"), "Serrucho Carpintero");
    escribir(productos.getByLabelText("Precio"), "12990");
    escribir(productos.getByLabelText("Stock"), "20");
    escribir(productos.getByLabelText("Categoría"), "3");
    fireEvent.click(productos.getByRole("button", { name: "Guardar producto" }));

    expect(await screen.findByText("Producto creado.")).toBeTruthy();
    const creacion = backend.llamadas.find((l) => l.method === "POST" && l.ruta === "/api/productos");
    expect(creacion?.token).toBe("token:admin@losmaestros.cl");
    expect(creacion?.body).toMatchObject({ nombre: "Serrucho Carpintero", precio: 12990, categoriaId: 3, stockInicial: 20 });
    expect(await screen.findByText("Serrucho Carpintero")).toBeTruthy();
});
