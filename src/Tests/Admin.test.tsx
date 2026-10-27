// @vitest-environment jsdom
// Prueba del panel administrador: acceso y creación de productos (CRUD)
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen, within } from "@testing-library/react";

import { escribir, irA, limpiarAlmacenamiento, renderApp } from "./helpers";

beforeEach(() => {
    limpiarAlmacenamiento();
});

afterEach(() => {
    cleanup();
});

// 19
test("el administrador ingresa y crea un producto que aparece en el catálogo", () => {
    renderApp();
    irA("Panel Admin");
    escribir(screen.getByLabelText("Correo"), "admin@losmaestros.cl");
    escribir(screen.getByLabelText("Contraseña"), "Admin123");
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("heading", { name: "Panel administrador" })).toBeTruthy();

    const encabezado = screen.getByRole("heading", { name: "Gestión de productos" });
    const productos = within(encabezado.parentElement as HTMLElement);
    escribir(productos.getByLabelText("Nombre"), "Serrucho Carpintero");
    escribir(productos.getByLabelText("Precio"), "12990");
    escribir(productos.getByLabelText("Stock"), "20");
    escribir(productos.getByLabelText("Categoría"), "Herramientas manuales");
    fireEvent.click(productos.getByRole("button", { name: "Guardar producto" }));

    irA("Catálogo");

    expect(screen.getByRole("heading", { name: "Serrucho Carpintero" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Ver detalle" }).length).toBe(9);
});
