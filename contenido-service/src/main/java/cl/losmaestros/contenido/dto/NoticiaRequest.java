package cl.losmaestros.contenido.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NoticiaRequest(
        @NotBlank(message = "El título es obligatorio.")
        @Size(max = 120, message = "El título debe tener máximo 120 caracteres.")
        String titulo,

        @Size(max = 500)
        String imagen,

        @Size(max = 200)
        String imagenAlt,

        @NotBlank(message = "El resumen es obligatorio.")
        @Size(max = 300, message = "El resumen debe tener máximo 300 caracteres.")
        String resumen,

        @NotBlank(message = "El detalle es obligatorio.")
        @Size(max = 5000, message = "El detalle debe tener máximo 5000 caracteres.")
        String detalle,

        /** Si no se envía, la noticia queda publicada. */
        Boolean publicada
) {
}
