package cl.losmaestros.contacto.dto;

import cl.losmaestros.contacto.model.Consulta;

import java.time.LocalDateTime;

public record ConsultaResponse(Long id, String nombre, String correo, String mensaje, String estado,
                               String respuesta, LocalDateTime creadoEn, LocalDateTime respondidoEn) {

    public static ConsultaResponse de(Consulta c) {
        return new ConsultaResponse(c.getId(), c.getNombre(), c.getCorreo(), c.getMensaje(), c.getEstado().name(),
                c.getRespuesta(), c.getCreadoEn(), c.getRespondidoEn());
    }
}
