// Funciones de apoyo compartidas por las pruebas (no es un archivo de pruebas).
import { render, screen, fireEvent, within } from "@testing-library/react";

import App from "../App";
import { sesionStore } from "../api/session";
import { crearBackendFalso } from "./backendFalso";

// Renderiza la aplicación completa
export function renderApp() {
    return render(<App />);
}

// Navega a una vista usando los botones del menú principal
export function irA(nombreBoton: string) {
    const menu = screen.getByRole("navigation");
    fireEvent.click(within(menu).getByRole("button", { name: nombreBoton }));
}

// Escribe un valor en un campo (input, textarea o select)
export function escribir(campo: HTMLElement, valor: string) {
    fireEvent.change(campo, { target: { value: valor } });
}

// Deja el navegador sin datos ni sesión y conecta el backend simulado
export function prepararBackend(opciones: { caido?: boolean } = {}) {
    localStorage.clear();
    sessionStorage.clear();
    sesionStore.limpiar();
    const backend = crearBackendFalso(opciones);
    globalThis.fetch = backend.fetchMock as unknown as typeof fetch;
    return backend;
}

// Inicia sesión desde el formulario de la página
export function iniciarSesion(correo: string, password: string) {
    irA("Iniciar sesión");
    escribir(screen.getByLabelText("Correo"), correo);
    escribir(screen.getByLabelText("Contraseña"), password);
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
}
