package cl.losmaestros.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Datos del formulario "Crea tu cuenta" del frontend. */
public record RegistroRequest(
        @NotBlank(message = "Ingrese un RUN válido, sin puntos ni guion.")
        String run,

        @NotBlank(message = "El nombre es obligatorio y debe tener máximo 50 caracteres.")
        @Size(max = 50, message = "El nombre es obligatorio y debe tener máximo 50 caracteres.")
        String nombre,

        @NotBlank(message = "Los apellidos son obligatorios y deben tener máximo 100 caracteres.")
        @Size(max = 100, message = "Los apellidos son obligatorios y deben tener máximo 100 caracteres.")
        String apellidos,

        @NotBlank(message = "Ingrese un correo válido de máximo 100 caracteres.")
        @Email(message = "Ingrese un correo válido de máximo 100 caracteres.")
        @Size(max = 100, message = "Ingrese un correo válido de máximo 100 caracteres.")
        String correo,

        @NotBlank(message = "Ingresa un teléfono válido para contactarte.")
        String telefono,

        @NotBlank(message = "Seleccione un tipo de usuario.")
        String tipo,

        @NotBlank(message = "Seleccione una región.")
        String region,

        @NotBlank(message = "Seleccione una comuna.")
        String comuna,

        @NotBlank(message = "La dirección es obligatoria y debe tener máximo 300 caracteres.")
        @Size(max = 300, message = "La dirección es obligatoria y debe tener máximo 300 caracteres.")
        String direccion,

        @NotBlank(message = "La contraseña es obligatoria.")
        String password,

        @NotBlank(message = "Repite tu contraseña.")
        String confirmarPassword
) {
}
