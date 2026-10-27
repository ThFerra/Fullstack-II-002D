// @vitest-environment jsdom
// Pruebas del formulario de contacto: ESTADO, EVENTOS y RENDERIZADO CONDICIONAL de errores
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { escribir, irA, limpiarAlmacenamiento, renderApp } from "./helpers";

beforeEach(() => {
    limpiarAlmacenamiento();
    renderApp();
    irA("Contacto");
});

afterEach(() => {
    cleanup();
});

function campos() {
    return {
        nombre: screen.getByLabelText("Nombre") as HTMLInputElement,
        correo: screen.getByLabelText("Correo") as HTMLInputElement,
        mensaje: screen.getByLabelText("Mensaje") as HTMLTextAreaElement,
    };
}

function enviar() {
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));
}

// 11
test("el estado del formulario cambia cuando el usuario escribe", () => {
    const { nombre, correo, mensaje } = campos();

    escribir(nombre, "Pedro Soto");
    escribir(correo, "pedro@correo.cl");
    escribir(mensaje, "Necesito una cotización");

    expect(nombre.value).toBe("Pedro Soto");
    expect(correo.value).toBe("pedro@correo.cl");
    expect(mensaje.value).toBe("Necesito una cotización");
});

// 12
test("el mensaje de error solo aparece cuando hay un error", () => {
    expect(document.querySelector(".form-message")).toBeNull();

    enviar();

    expect(screen.getByText("El nombre es obligatorio y debe tener máximo 100 caracteres.")).toBeTruthy();
});

// 13
test("un envío válido muestra confirmación y limpia los campos", () => {
    const { nombre, correo, mensaje } = campos();
    escribir(nombre, "Pedro Soto");
    escribir(correo, "pedro@correo.cl");
    escribir(mensaje, "Hola, ¿tienen cemento?");

    enviar();

    expect(screen.getByText("Consulta enviada correctamente.")).toBeTruthy();
    expect(campos().nombre.value).toBe("");
    expect(campos().mensaje.value).toBe("");
});
