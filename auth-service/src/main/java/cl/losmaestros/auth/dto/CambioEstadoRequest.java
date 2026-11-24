package cl.losmaestros.auth.dto;

import jakarta.validation.constraints.NotNull;

public record CambioEstadoRequest(@NotNull(message = "Indica si la cuenta queda activa.") Boolean activo) {
}
