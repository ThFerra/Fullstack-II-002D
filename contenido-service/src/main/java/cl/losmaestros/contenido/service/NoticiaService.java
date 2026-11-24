package cl.losmaestros.contenido.service;

import cl.losmaestros.contenido.dto.NoticiaRequest;
import cl.losmaestros.contenido.dto.NoticiaResponse;
import cl.losmaestros.contenido.exception.RecursoNoEncontradoException;
import cl.losmaestros.contenido.exception.ReglaNegocioException;
import cl.losmaestros.contenido.model.Noticia;
import cl.losmaestros.contenido.repository.NoticiaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoticiaService {

    private final NoticiaRepository noticias;

    public NoticiaService(NoticiaRepository noticias) {
        this.noticias = noticias;
    }

    /** El público ve solo las publicadas; el ADMIN puede pedir todas (incluye borradores). */
    @Transactional(readOnly = true)
    public List<NoticiaResponse> listar(boolean todas, boolean esAdmin) {
        if (todas && !esAdmin) {
            throw new ReglaNegocioException(HttpStatus.FORBIDDEN, "Solo un administrador puede ver las noticias no publicadas.");
        }
        List<Noticia> lista = todas ? noticias.findAllByOrderByCreadoEnDesc() : noticias.findByPublicadaTrueOrderByCreadoEnDesc();
        return lista.stream().map(NoticiaResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public NoticiaResponse obtener(Long id, boolean esAdmin) {
        Noticia noticia = (esAdmin ? noticias.findById(id) : noticias.findByIdAndPublicadaTrue(id))
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la noticia " + id + "."));
        return NoticiaResponse.de(noticia);
    }

    @Transactional
    public NoticiaResponse crear(NoticiaRequest req) {
        Noticia noticia = new Noticia();
        aplicar(noticia, req);
        return NoticiaResponse.de(noticias.save(noticia));
    }

    @Transactional
    public NoticiaResponse actualizar(Long id, NoticiaRequest req) {
        Noticia noticia = buscar(id);
        aplicar(noticia, req);
        return NoticiaResponse.de(noticias.saveAndFlush(noticia));
    }

    @Transactional
    public void eliminar(Long id) {
        noticias.delete(buscar(id));
    }

    private void aplicar(Noticia n, NoticiaRequest req) {
        n.setTitulo(req.titulo().trim());
        n.setImagen(req.imagen());
        n.setImagenAlt(req.imagenAlt() == null || req.imagenAlt().isBlank() ? req.titulo().trim() : req.imagenAlt().trim());
        n.setResumen(req.resumen().trim());
        n.setDetalle(req.detalle().trim());
        n.setPublicada(req.publicada() == null || req.publicada());
    }

    private Noticia buscar(Long id) {
        return noticias.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la noticia " + id + "."));
    }
}
