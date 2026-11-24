package cl.losmaestros.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CambioCorreoRequest(
        @NotBlank @Email String correoActual,
        @NotBlank @Email @Size(max = 100) String correoNuevo
) {
}
