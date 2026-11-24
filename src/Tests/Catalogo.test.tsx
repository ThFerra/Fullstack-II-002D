// @vitest-environment jsdom
// Pruebas del catálogo y del carrito conectados al backend (productos, inventario y carrito)
import { afterEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen, within } from "@testing-library/react";

import { iniciarSesion, irA, prepararBackend, renderApp } from "./helpers";

afterEach(() => {
    cleanup();
});

// Devuelve el panel lateral del carrito
function panelCarrito() {
    const titulo = screen.getByRole("heading", { name: "Mi selección / pedido" });
    return within(titulo.parentElement as HTMLElement);
}

async function entrarComoClienteAlCatalogo() {
    renderApp();
    iniciarSesion("cliente@losmaestros.cl", "Cliente123");
    await screen.findByRole("heading", { name: "Hola, Cliente" });
    irA("Catálogo");
    return screen.findAllByRole("button", { name: "Agregar" });
}

// 5
test("el catálogo muestra los 8 productos que entrega la API con su stock", async () => {
    prepararBackend();
    renderApp();
    irA("Catálogo");

    expect((await screen.findAllByRole("button", { name: "Ver detalle" })).length).toBe(8);
    expect(screen.getByText("Stock disponible: 12")).toBeTruthy();
    expect(screen.getByText("$79.990")).toBeTruthy();
});

// 6
test("sin sesión, 'Agregar' lleva al login en vez de usar el carrito", async () => {
    prepararBackend();
    renderApp();
    irA("Catálogo");

    fireEvent.click((await screen.findAllByRole("button", { name: "Agregar" }))[0]);

    expect(screen.getByRole("heading", { name: "Accede a tu cuenta" })).toBeTruthy();
    expect(screen.getByText("Inicia sesión para agregar productos a tu selección.")).toBeTruthy();
});

// 7
test("con sesión, agregar y quitar un producto actualiza el carrito del servidor", async () => {
    const backend = prepararBackend();
    const botones = await entrarComoClienteAlCatalogo();

    fireEvent.click(botones[3]); // Llave Monomando $22.990

    expect(await panelCarrito().findByText("Llave Monomando Lavaplatos")).toBeTruthy();
    expect(panelCarrito().getAllByText("$22.990").length).toBe(2); // subtotal y total
    const agregar = backend.llamadas.find((l) => l.method === "POST" && l.ruta === "/api/carrito/items");
    expect(agregar?.token).toBe("token:cliente@losmaestros.cl");

    fireEvent.click(panelCarrito().getByRole("button", { name: "Quitar Llave Monomando Lavaplatos" }));

    expect(await panelCarrito().findByText("Tu selección está vacía.")).toBeTruthy();
});

// 8
test("muestra el error del backend cuando no hay stock suficiente (409)", async () => {
    const backend = prepararBackend();
    backend.stock.set(4, 1);
    const botones = await entrarComoClienteAlCatalogo();

    fireEvent.click(botones[3]);
    await panelCarrito().findByText("Llave Monomando Lavaplatos");
    fireEvent.click(botones[3]);

    expect(await screen.findByText("Stock insuficiente: quedan 1 unidad(es).")).toBeTruthy();
});

// 9
test("si el backend está apagado, el catálogo muestra un mensaje de error", async () => {
    prepararBackend({ caido: true });
    renderApp();
    irA("Catálogo");

    const alerta = await screen.findByRole("alert");
    expect(alerta.textContent).toContain("No se pudo cargar el catálogo");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeTruthy();
});
