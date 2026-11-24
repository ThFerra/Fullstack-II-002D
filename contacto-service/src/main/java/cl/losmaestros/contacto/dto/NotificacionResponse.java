package cl.losmaestros.contacto.dto;

import cl.losmaestros.contacto.model.Notificacion;

import java.time.LocalDateTime;

public record NotificacionResponse(Long id, String destinatario, String asunto, String cuerpo, LocalDateTime enviadoEn) {

    public static NotificacionResponse de(Notificacion n) {
        return new NotificacionResponse(n.getId(), n.getDestinatario(), n.getAsunto(), n.getCuerpo(), n.getEnviadoEn());
    }
}
