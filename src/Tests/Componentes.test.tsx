// @vitest-environment jsdom
// Pruebas de PROPIEDADES (props) y RENDERIZADO de listas con los componentes de src/components
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { categories } from "../data/store";

afterEach(() => {
    cleanup();
});

// 1
test("ProductCard muestra el nombre, precio, etiqueta y botón recibidos por props", () => {
    render(<ProductCard name="Taladro Percutor Bosch" price="$2,499" tag="Popular" />);

    expect(screen.getByRole("heading", { name: "Taladro Percutor Bosch" })).toBeTruthy();
    expect(screen.getByText("$2,499")).toBeTruthy();
    expect(screen.getByText("Popular")).toBeTruthy();
    expect(screen.getByRole("button").textContent).toBe("Agregar");
});

// 2
test("CategoryCard renderiza todas las categorías del archivo de datos", () => {
    render(
        <>
            {categories.map((c) => (
                <CategoryCard key={c.title} icon={c.icon} title={c.title} description={c.description} />
            ))}
        </>
    );

    expect(screen.getAllByRole("heading").length).toBe(categories.length);
    categories.forEach((c) => {
        expect(screen.getByText(c.description)).toBeTruthy();
    });
});
