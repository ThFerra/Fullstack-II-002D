package cl.losmaestros.auth.dto;

import cl.losmaestros.auth.model.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Usado por usuarios-service al registrar un usuario (llamada interna). */
public record CrearCredencialRequest(
        @NotBlank @Email @Size(max = 100)
        String correo,

        @NotBlank
        String password,

        @NotNull
        Rol rol
) {
}
