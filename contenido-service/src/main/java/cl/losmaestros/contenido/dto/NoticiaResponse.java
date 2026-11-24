package cl.losmaestros.contenido.dto;

import cl.losmaestros.contenido.model.Noticia;

import java.time.LocalDateTime;

public record NoticiaResponse(Long id, String titulo, String imagen, String imagenAlt, String resumen, String detalle,
                              boolean publicada, LocalDateTime creadoEn, LocalDateTime actualizadoEn) {

    public static NoticiaResponse de(Noticia n) {
        return new NoticiaResponse(n.getId(), n.getTitulo(), n.getImagen(), n.getImagenAlt(), n.getResumen(),
                n.getDetalle(), n.isPublicada(), n.getCreadoEn(), n.getActualizadoEn());
    }
}
