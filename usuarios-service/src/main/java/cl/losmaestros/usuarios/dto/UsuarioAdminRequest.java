package cl.losmaestros.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Datos del formulario "Gestión de usuarios" del panel admin.
 * password y rol solo se usan al crear (al editar se ignoran).
 */
public record UsuarioAdminRequest(
        @NotBlank(message = "El RUN es obligatorio.")
        String run,

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 50)
        String nombre,

        @Size(max = 100)
        String apellidos,

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "Ingresa un correo válido.")
        @Size(max = 100)
        String correo,

        String telefono,

        @NotBlank(message = "El tipo de usuario es obligatorio.")
        String tipo,

        String region,
        String comuna,

        @Size(max = 300)
        String direccion,

        String password,

        @Pattern(regexp = "ADMIN|CLIENTE", message = "El rol debe ser ADMIN o CLIENTE.")
        String rol
) {
}
