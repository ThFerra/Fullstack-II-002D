package cl.losmaestros.contacto.repository;

import cl.losmaestros.contacto.model.Consulta;
import cl.losmaestros.contacto.model.EstadoConsulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    List<Consulta> findAllByOrderByCreadoEnDesc();

    List<Consulta> findByEstadoOrderByCreadoEnDesc(EstadoConsulta estado);

    List<Consulta> findByCorreoIgnoreCaseOrderByCreadoEnDesc(String correo);
}
