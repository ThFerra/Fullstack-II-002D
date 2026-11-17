// @vitest-environment jsdom
// Pruebas del inicio de sesión de cliente
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { escribir, irA, limpiarAlmacenamiento, renderApp } from "./helpers";

beforeEach(() => {
    limpiarAlmacenamiento();
    renderApp();
    irA("Iniciar sesión");
});

afterEach(() => {
    cleanup();
});

function iniciarSesion(correo: string, password: string) {
    escribir(screen.getByLabelText("Correo"), correo);
    escribir(screen.getByLabelText("Contraseña"), password);
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
}

// 17 - PRUEBA DE FALLO: verifica que el sistema detecta el error y NO deja entrar
test("PRUEBA DE FALLO: el login falla con una contraseña incorrecta y no crea sesión", async () => {
    iniciarSesion("cliente@losmaestros.cl", "ContraseñaMala1");

    expect(
        await screen.findByText("El correo o la contraseña no coinciden con una cuenta registrada.")
    ).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Hola, Cliente" })).toBeNull();
    expect(sessionStorage.getItem("los_maestros_user_session")).toBeNull();
});

// 18
test("con la cuenta demo inicia sesión, guarda la sesión y abre el perfil", async () => {
    iniciarSesion("cliente@losmaestros.cl", "Cliente123");

    expect(await screen.findByRole("heading", { name: "Hola, Cliente" })).toBeTruthy();
    expect(sessionStorage.getItem("los_maestros_user_session")).toBe("active");
});
