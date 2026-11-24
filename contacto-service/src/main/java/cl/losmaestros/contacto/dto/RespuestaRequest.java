package cl.losmaestros.contacto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RespuestaRequest(
        @NotBlank(message = "La respuesta es obligatoria.")
        @Size(max = 1000, message = "La respuesta debe tener máximo 1000 caracteres.")
        String respuesta
) {
}
