package cl.losmaestros.contacto.dto;

/** Respuesta del formulario público: el mensaje que muestra el frontend y el número de la consulta. */
public record ConsultaCreadaResponse(String mensaje, Long consultaId) {
}
