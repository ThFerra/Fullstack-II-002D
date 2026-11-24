// @vitest-environment jsdom
// Pruebas del registro: selects dependientes, validación del RUN y creación de cuenta en usuarios-service
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { escribir, irA, prepararBackend, renderApp } from "./helpers";
import type { Llamada } from "./backendFalso";

let llamadas: Llamada[];

const datosValidos = {
    run: "123456785", nombre: "Ana", apellidos: "Rojas Pérez", correo: "ana@correo.cl",
    telefono: "+56 9 8765 4321", tipo: "Cliente", region: "Coquimbo", comuna: "La Serena",
    direccion: "Av. Francisco de Aguirre 100", password: "Clave1234", confirmarPassword: "Clave1234",
};

function campo(etiqueta: string) {
    return screen.getByLabelText(etiqueta) as HTMLInputElement | HTMLSelectElement;
}

function llenarFormulario(cambios: Partial<typeof datosValidos> = {}) {
    const d = { ...datosValidos, ...cambios };
    escribir(campo("RUN"), d.run);
    escribir(campo("Nombre"), d.nombre);
    escribir(campo("Apellidos"), d.apellidos);
    escribir(campo("Correo"), d.correo);
    escribir(campo("Teléfono de contacto"), d.telefono);
    escribir(campo("Tipo de usuario"), d.tipo);
    escribir(campo("Región"), d.region);
    escribir(campo("Comuna"), d.comuna);
    escribir(campo("Dirección"), d.direccion);
    escribir(campo("Contraseña"), d.password);
    escribir(campo("Repite tu contraseña"), d.confirmarPassword);
}

function enviar() {
    fireEvent.submit(screen.getByRole("button", { name: "Crear mi cuenta" }).closest("form") as HTMLFormElement);
}

beforeEach(() => {
    llamadas = prepararBackend().llamadas;
    renderApp();
    irA("Registrarse");
});

afterEach(() => {
    cleanup();
});

// 13
test("la comuna se habilita y muestra las comunas de la región que entrega la API", async () => {
    await screen.findByRole("option", { name: "Tarapacá" });
    expect((campo("Comuna") as HTMLSelectElement).disabled).toBe(true);

    escribir(campo("Región"), "Coquimbo");

    const opciones = Array.from((campo("Comuna") as HTMLSelectElement).options).map((o) => o.value);
    expect((campo("Comuna") as HTMLSelectElement).disabled).toBe(false);
    expect(opciones).toEqual(["", "La Serena", "Coquimbo", "Ovalle", "Vicuña"]);
});

// 14
test("un RUN inválido se rechaza antes de llamar al backend", () => {
    llenarFormulario({ run: "123456789" });

    enviar();

    expect(screen.getByText("Ingrese un RUN válido, sin puntos ni guion.")).toBeTruthy();
    expect(llamadas.some((l) => l.ruta === "/api/usuarios/registro")).toBe(false);
});

// 15
test("un registro válido crea la cuenta en el backend e inicia sesión", async () => {
    await screen.findByRole("option", { name: "Tarapacá" });
    llenarFormulario();

    enviar();

    expect(await screen.findByRole("heading", { name: "Hola, Ana" })).toBeTruthy();
    const registro = llamadas.find((l) => l.ruta === "/api/usuarios/registro");
    expect(registro?.body?.correo).toBe("ana@correo.cl");
    expect(llamadas.some((l) => l.ruta === "/api/auth/login")).toBe(true);
});
