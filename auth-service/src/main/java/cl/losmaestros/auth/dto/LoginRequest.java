package cl.losmaestros.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "Ingresa un correo válido.")
        @Size(max = 100, message = "El correo debe tener máximo 100 caracteres.")
        String correo,

        @NotBlank(message = "Ingresa tu contraseña.")
        String password
) {
}
