package cl.losmaestros.inventario.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CrearStockRequest(
        @NotNull Long productoId,
        @NotNull @Min(0) Integer cantidad
) {
}
