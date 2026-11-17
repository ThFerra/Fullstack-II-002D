// @vitest-environment jsdom
// Pruebas de RENDERIZADO de la vista de inicio y EVENTOS del menú de navegación
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, screen } from "@testing-library/react";

import { irA, limpiarAlmacenamiento, renderApp } from "./helpers";

beforeEach(() => {
    limpiarAlmacenamiento();
});

afterEach(() => {
    cleanup();
});

// 3
test("el inicio muestra las 4 categorías y solo 3 productos destacados", () => {
    renderApp();

    ["Herramientas", "Ferretería", "Electricidad", "Pintura"].forEach((titulo) => {
        expect(screen.getByRole("heading", { name: titulo })).toBeTruthy();
    });
    expect(screen.getAllByRole("button", { name: "Agregar" }).length).toBe(3);
});

// 4
test("al hacer clic en el menú se cambia de vista y se oculta la anterior", () => {
    renderApp();

    irA("Contacto");

    expect(screen.getByRole("heading", { name: "Escríbenos" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Recomendados para ti" })).toBeNull();
});
