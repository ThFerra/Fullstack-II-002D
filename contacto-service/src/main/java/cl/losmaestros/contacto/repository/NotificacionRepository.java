package cl.losmaestros.contacto.repository;

import cl.losmaestros.contacto.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findAllByOrderByEnviadoEnDesc();
}
