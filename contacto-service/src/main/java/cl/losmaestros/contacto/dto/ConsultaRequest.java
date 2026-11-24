package cl.losmaestros.contacto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Mismas reglas y mensajes que el formulario de contacto del frontend. */
public record ConsultaRequest(
        @NotBlank(message = "El nombre es obligatorio y debe tener máximo 100 caracteres.")
        @Size(max = 100, message = "El nombre es obligatorio y debe tener máximo 100 caracteres.")
        String nombre,

        @NotBlank(message = "Ingrese un correo válido de máximo 100 caracteres.")
        @Email(message = "Ingrese un correo válido de máximo 100 caracteres.")
        @Size(max = 100, message = "Ingrese un correo válido de máximo 100 caracteres.")
        String correo,

        @NotBlank(message = "El comentario es obligatorio y debe tener máximo 500 caracteres.")
        @Size(max = 500, message = "El comentario es obligatorio y debe tener máximo 500 caracteres.")
        String mensaje
) {
}
