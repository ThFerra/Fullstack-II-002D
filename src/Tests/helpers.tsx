// Funciones de apoyo compartidas por las pruebas (no es un archivo de pruebas).
import { render, screen, fireEvent, within } from "@testing-library/react";

import App from "../App";

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

// Deja el almacenamiento del navegador limpio antes de cada prueba
export function limpiarAlmacenamiento() {
    localStorage.clear();
    sessionStorage.clear();
}
