// @vitest-environment jsdom
// Pruebas de autenticación con JWT y de la sesión en el frontend
import { afterEach, expect, test } from "vitest";
import { cleanup, screen, within } from "@testing-library/react";

import { iniciarSesion, irA, prepararBackend, renderApp } from "./helpers";
import { sesionStore } from "../api/session";

afterEach(() => {
    cleanup();
});

function menu() {
    return within(screen.getByRole("navigation"));
}

// 16 - PRUEBA DE FALLO: verifica que el sistema detecta el error y NO deja entrar
test("PRUEBA DE FALLO: el login falla con una contraseña incorrecta y no guarda sesión", async () => {
    prepararBackend();
    renderApp();

    iniciarSesion("cliente@losmaestros.cl", "ContraseñaMala1");

    expect(await screen.findByText("El correo o la contraseña no coinciden con una cuenta registrada.")).toBeTruthy();
    expect(localStorage.getItem("los_maestros_sesion")).toBeNull();
    expect(menu().getByRole("button", { name: "Iniciar sesión" })).toBeTruthy();
});

// 17
test("el login guarda el token JWT y el menú cambia según el rol CLIENTE", async () => {
    prepararBackend();
    renderApp();

    iniciarSesion("cliente@losmaestros.cl", "Cliente123");

    expect(await screen.findByRole("heading", { name: "Hola, Cliente" })).toBeTruthy();
    const guardada = JSON.parse(localStorage.getItem("los_maestros_sesion") || "{}");
    expect(guardada.accessToken).toBe("token:cliente@losmaestros.cl");
    expect(guardada.rol).toBe("CLIENTE");
    expect(menu().queryByRole("button", { name: "Iniciar sesión" })).toBeNull();
    expect(menu().queryByRole("button", { name: "Panel Admin" })).toBeNull();
    expect(menu().getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
});

// 18
test("la sesión se mantiene al recargar y renueva el token vencido", async () => {
    const backend = prepararBackend();
    localStorage.setItem("los_maestros_sesion", JSON.stringify({
        accessToken: "token-vencido",
        refreshToken: "refresh:cliente@losmaestros.cl",
        correo: "cliente@losmaestros.cl",
        rol: "CLIENTE",
        expiraEn: Date.now() - 1000,
    }));
    sesionStore.recargar(); // simula abrir la página de nuevo

    renderApp();
    irA("Mi perfil");

    expect(await screen.findByRole("heading", { name: "Hola, Cliente" })).toBeTruthy();
    expect(backend.llamadas.some((l) => l.ruta === "/api/auth/refresh")).toBe(true);
    expect(sesionStore.obtener()?.accessToken).toBe("token:cliente@losmaestros.cl");
});
