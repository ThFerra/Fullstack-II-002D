package cl.losmaestros.carrito.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CambiarCantidadRequest(
        @NotNull(message = "La cantidad es obligatoria.")
        @Min(value = 1, message = "La cantidad debe ser al menos 1. Para quitar el producto usa DELETE.")
        @Max(value = 99, message = "La cantidad máxima por producto es 99.")
        Integer cantidad
) {
}
