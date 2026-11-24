package cl.losmaestros.productos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Datos del formulario "Gestión de productos". stockInicial solo se usa al crear. */
public record ProductoRequest(
        @NotBlank(message = "El nombre del producto es obligatorio.")
        @Size(max = 100, message = "El nombre debe tener máximo 100 caracteres.")
        String nombre,

        @Size(max = 500, message = "La descripción debe tener máximo 500 caracteres.")
        String descripcion,

        @NotNull(message = "El precio es obligatorio.")
        @Min(value = 0, message = "El precio no puede ser negativo.")
        Integer precio,

        @Size(max = 500)
        String imagen,

        @NotNull(message = "La categoría es obligatoria.")
        Long categoriaId,

        @Min(value = 0, message = "El stock no puede ser negativo.")
        Integer stockInicial
) {
}
