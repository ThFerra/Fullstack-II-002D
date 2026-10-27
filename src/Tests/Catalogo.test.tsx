// @vitest-environment jsdom
// Pruebas del catálogo, detalle de producto y carrito (renderizado, estado y eventos)
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen, within } from "@testing-library/react";

import { irA, limpiarAlmacenamiento, renderApp } from "./helpers";

beforeEach(() => {
    limpiarAlmacenamiento();
});

afterEach(() => {
    cleanup();
});

// Devuelve el panel lateral del carrito
function panelCarrito() {
    const titulo = screen.getByRole("heading", { name: "Mi selección / pedido" });
    return within(titulo.parentElement as HTMLElement);
}

// 5
test("el catálogo renderiza los 8 productos con su stock", () => {
    renderApp();
    irA("Catálogo");

    expect(screen.getAllByRole("button", { name: "Ver detalle" }).length).toBe(8);
    expect(screen.getAllByText(/Stock disponible:/).length).toBe(8);
});

// 6
test("el mensaje de carrito vacío solo se muestra cuando no hay productos", () => {
    renderApp();
    irA("Catálogo");
    expect(panelCarrito().getByText("Tu selección está vacía.")).toBeTruthy();

    irA("Inicio");
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
    irA("Catálogo");

    expect(panelCarrito().queryByText("Tu selección está vacía.")).toBeNull();
    expect(panelCarrito().getByText("Saco Cemento Polpaico 25kg")).toBeTruthy();
});

// 7
test("agregar dos productos calcula el total y lo guarda en localStorage", () => {
    renderApp();

    const botones = screen.getAllByRole("button", { name: "Agregar" });
    fireEvent.click(botones[0]); // Cemento $4.890
    fireEvent.click(botones[1]); // Taladro $79.990
    irA("Catálogo");

    expect(panelCarrito().getByText("$84.880")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("carrito_maestros") || "[]").length).toBe(2);
});

// 8
test("el botón ❌ quita solo ese producto del carrito", () => {
    renderApp();
    const botones = screen.getAllByRole("button", { name: "Agregar" });
    fireEvent.click(botones[0]);
    fireEvent.click(botones[1]);
    irA("Catálogo");

    fireEvent.click(panelCarrito().getAllByRole("button", { name: "❌" })[0]);

    expect(panelCarrito().queryByText("Saco Cemento Polpaico 25kg")).toBeNull();
    expect(panelCarrito().getByText("Taladro Percutor 18V")).toBeTruthy();
});

// 9
test("'Vaciar carrito' elimina todos los productos y deja el total en $0", () => {
    renderApp();
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
    irA("Catálogo");

    fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));

    expect(panelCarrito().getByText("Tu selección está vacía.")).toBeTruthy();
    expect(panelCarrito().getByText("$0")).toBeTruthy();
});

// 10
test("'Ver detalle' muestra la descripción y precio del producto", () => {
    renderApp();
    irA("Catálogo");

    fireEvent.click(screen.getAllByRole("button", { name: "Ver detalle" })[1]);

    expect(screen.getByRole("heading", { name: "Taladro Percutor 18V" })).toBeTruthy();
    expect(screen.getByText("Taladro de alto torque para perforación y impacto profesional.")).toBeTruthy();
    expect(screen.getByText("$79.990")).toBeTruthy();
});
