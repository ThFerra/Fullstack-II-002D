// @vitest-environment jsdom
// Pruebas del formulario de registro: validación del RUN, selects dependientes y creación de cuenta
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { escribir, irA, limpiarAlmacenamiento, renderApp } from "./helpers";

const datosValidos = {
    run: "123456785",
    nombre: "Ana",
    apellidos: "Rojas Pérez",
    correo: "ana@correo.cl",
    telefono: "+56 9 8765 4321",
    tipo: "Cliente",
    region: "Coquimbo",
    comuna: "La Serena",
    direccion: "Av. Francisco de Aguirre 100",
    password: "Clave1234",
    confirmarPassword: "Clave1234",
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

// Se usa submit directamente para probar las validaciones de React
// (sin depender de los atributos "required" del navegador)
function enviar() {
    fireEvent.submit(screen.getByRole("button", { name: "Crear mi cuenta" }).closest("form") as HTMLFormElement);
}

beforeEach(() => {
    limpiarAlmacenamiento();
    renderApp();
    irA("Registrarse");
});

afterEach(() => {
    cleanup();
});

// 14
test("la comuna se habilita y muestra solo las comunas de la región elegida", () => {
    expect((campo("Comuna") as HTMLSelectElement).disabled).toBe(true);

    escribir(campo("Región"), "Coquimbo");

    const opciones = Array.from((campo("Comuna") as HTMLSelectElement).options).map((o) => o.value);
    expect((campo("Comuna") as HTMLSelectElement).disabled).toBe(false);
    expect(opciones).toEqual(["", "La Serena", "Coquimbo", "Ovalle", "Vicuña"]);
});

// 15
test("rechaza un RUN con dígito verificador incorrecto", () => {
    llenarFormulario({ run: "123456789" });

    enviar();

    expect(screen.getByText("Ingrese un RUN válido, sin puntos ni guion.")).toBeTruthy();
});

// 16
test("un registro válido crea la cuenta con la contraseña cifrada y abre el perfil", async () => {
    llenarFormulario();

    enviar();

    expect(await screen.findByRole("heading", { name: "Hola, Ana" })).toBeTruthy();
    const cuentas = JSON.parse(localStorage.getItem("cuentas_maestros") || "[]");
    expect(cuentas.length).toBe(1);
    expect(cuentas[0].correo).toBe("ana@correo.cl");
    expect(JSON.stringify(cuentas)).not.toContain("Clave1234");
});
