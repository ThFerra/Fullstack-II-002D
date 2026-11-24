package cl.losmaestros.inventario.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AjusteStockRequest(
        @NotNull(message = "La cantidad es obligatoria.")
        @Min(value = 0, message = "El stock no puede ser negativo.")
        Integer cantidad,

        @Min(value = 0, message = "El stock mínimo no puede ser negativo.")
        Integer stockMinimo,

        @Size(max = 200)
        String motivo
) {
}
