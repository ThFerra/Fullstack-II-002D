package cl.losmaestros.auth.dto;

import cl.losmaestros.auth.model.Credencial;

import java.time.LocalDateTime;

public record CredencialResponse(Long id, String correo, String rol, boolean activo, LocalDateTime creadoEn) {

    public static CredencialResponse de(Credencial c) {
        return new CredencialResponse(c.getId(), c.getCorreo(), c.getRol().name(), c.isActivo(), c.getCreadoEn());
    }
}
