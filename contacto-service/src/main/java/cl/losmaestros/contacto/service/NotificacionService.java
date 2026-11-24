package cl.losmaestros.contacto.service;

import cl.losmaestros.contacto.dto.NotificacionResponse;
import cl.losmaestros.contacto.model.Notificacion;
import cl.losmaestros.contacto.repository.NotificacionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** "Envía" correos: los guarda en la tabla notificaciones y los muestra en el log del servicio. */
@Service
public class NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionService.class);

    private final NotificacionRepository repositorio;

    public NotificacionService(NotificacionRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Transactional
    public void enviar(String destinatario, String asunto, String cuerpo) {
        repositorio.save(new Notificacion(destinatario, asunto, cuerpo));
        log.info("[CORREO SIMULADO] Para: {} | Asunto: {}", destinatario, asunto);
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listar() {
        return repositorio.findAllByOrderByEnviadoEnDesc().stream().map(NotificacionResponse::de).toList();
    }
}
