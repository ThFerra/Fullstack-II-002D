package cl.losmaestros.productos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "El nombre de la categoría es obligatorio.")
        @Size(max = 50, message = "El nombre debe tener máximo 50 caracteres.")
        String nombre,

        @Size(max = 255, message = "La descripción debe tener máximo 255 caracteres.")
        String descripcion
) {
}
