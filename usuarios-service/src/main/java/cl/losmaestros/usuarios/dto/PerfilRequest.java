package cl.losmaestros.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Datos que el usuario puede editar en "Mi perfil". */
public record PerfilRequest(
        @NotBlank(message = "El nombre y los apellidos son obligatorios.")
        @Size(max = 50)
        String nombre,

        @NotBlank(message = "El nombre y los apellidos son obligatorios.")
        @Size(max = 100)
        String apellidos,

        @NotBlank(message = "Ingresa un correo válido.")
        @Email(message = "Ingresa un correo válido.")
        @Size(max = 100)
        String correo,

        @NotBlank(message = "Ingresa un teléfono válido.")
        String telefono,

        @NotBlank(message = "Completa región, comuna y dirección.")
        String region,

        @NotBlank(message = "Completa región, comuna y dirección.")
        String comuna,

        @NotBlank(message = "Completa región, comuna y dirección.")
        @Size(max = 300)
        String direccion
) {
}
