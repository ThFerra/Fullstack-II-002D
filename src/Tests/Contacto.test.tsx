// @vitest-environment jsdom
// Pruebas del formulario de contacto: ESTADO, RENDERIZADO CONDICIONAL y envío a contacto-service
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { escribir, irA, prepararBackend, renderApp } from "./helpers";
import type { Llamada } from "./backendFalso";

let llamadas: Llamada[];

beforeEach(() => {
    llamadas = prepararBackend().llamadas;
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

// 10
test("el estado del formulario cambia cuando el usuario escribe", () => {
    const { nombre, correo, mensaje } = campos();

    escribir(nombre, "Pedro Soto");
    escribir(correo, "pedro@correo.cl");
    escribir(mensaje, "Necesito una cotización");

    expect(nombre.value).toBe("Pedro Soto");
    expect(correo.value).toBe("pedro@correo.cl");
    expect(mensaje.value).toBe("Necesito una cotización");
});

// 11
test("el mensaje de error solo aparece cuando hay un error y no se llama a la API", () => {
    expect(document.querySelector(".form-message")).toBeNull();

    enviar();

    expect(screen.getByText("El nombre es obligatorio y debe tener máximo 100 caracteres.")).toBeTruthy();
    expect(llamadas.some((l) => l.ruta === "/api/contacto")).toBe(false);
});

// 12
test("un envío válido llega a la API, muestra su respuesta y limpia los campos", async () => {
    const { nombre, correo, mensaje } = campos();
    escribir(nombre, "Pedro Soto");
    escribir(correo, "pedro@correo.cl");
    escribir(mensaje, "Hola, ¿tienen cemento?");

    enviar();

    expect(await screen.findByText("Consulta enviada correctamente.")).toBeTruthy();
    const envio = llamadas.find((l) => l.method === "POST" && l.ruta === "/api/contacto");
    expect(envio?.body).toEqual({ nombre: "Pedro Soto", correo: "pedro@correo.cl", mensaje: "Hola, ¿tienen cemento?" });
    expect(campos().nombre.value).toBe("");
});
