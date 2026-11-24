package cl.losmaestros.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record CambioPasswordRequest(
        @NotBlank(message = "Ingresa tu contraseña actual.") String passwordActual,
        @NotBlank(message = "Ingresa la nueva contraseña.") String passwordNueva
) {
}
