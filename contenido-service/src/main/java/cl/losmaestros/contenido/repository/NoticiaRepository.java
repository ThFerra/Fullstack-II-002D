package cl.losmaestros.contenido.repository;

import cl.losmaestros.contenido.model.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticiaRepository extends JpaRepository<Noticia, Long> {

    List<Noticia> findByPublicadaTrueOrderByCreadoEnDesc();

    List<Noticia> findAllByOrderByCreadoEnDesc();

    Optional<Noticia> findByIdAndPublicadaTrue(Long id);
}
