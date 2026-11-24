package cl.losmaestros.contacto.service;

import cl.losmaestros.contacto.dto.*;
import cl.losmaestros.contacto.exception.RecursoNoEncontradoException;
import cl.losmaestros.contacto.exception.ReglaNegocioException;
import cl.losmaestros.contacto.model.Consulta;
import cl.losmaestros.contacto.model.EstadoConsulta;
import cl.losmaestros.contacto.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultaService {

    private final ConsultaRepository consultas;
    private final NotificacionService notificaciones;
    private final String correoAdmin;

    public ConsultaService(ConsultaRepository consultas, NotificacionService notificaciones,
                           @Value("${app.notificaciones.correo-admin}") String correoAdmin) {
        this.consultas = consultas;
        this.notificaciones = notificaciones;
        this.correoAdmin = correoAdmin;
    }

    /** Guarda la consulta, confirma la recepción al cliente y avisa al administrador. */
    @Transactional
    public ConsultaCreadaResponse crear(ConsultaRequest req) {
        Consulta consulta = new Consulta();
        consulta.setNombre(req.nombre().trim());
        consulta.setCorreo(req.correo().trim().toLowerCase());
        consulta.setMensaje(req.mensaje().trim());
        consultas.save(consulta);

        notificaciones.enviar(consulta.getCorreo(),
                "Recibimos tu consulta #" + consulta.getId(),
                "Hola " + consulta.getNombre() + ", recibimos tu mensaje y te responderemos pronto.\n\n"
                        + "Tu mensaje: " + consulta.getMensaje() + "\n\nFerretería Los Maestros");
        notificaciones.enviar(correoAdmin,
                "Nueva consulta #" + consulta.getId() + " de " + consulta.getNombre(),
                "Correo: " + consulta.getCorreo() + "\nMensaje: " + consulta.getMensaje());

        return new ConsultaCreadaResponse("Consulta enviada correctamente.", consulta.getId());
    }

    @Transactional(readOnly = true)
    public List<ConsultaResponse> listar(EstadoConsulta estado) {
        List<Consulta> lista = estado == null
                ? consultas.findAllByOrderByCreadoEnDesc()
                : consultas.findByEstadoOrderByCreadoEnDesc(estado);
        return lista.stream().map(ConsultaResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultaResponse> deUsuario(String correo) {
        return consultas.findByCorreoIgnoreCaseOrderByCreadoEnDesc(correo).stream().map(ConsultaResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public ConsultaResponse obtener(Long id) {
        return ConsultaResponse.de(buscar(id));
    }

    /** Responde la consulta y envía la respuesta por correo al cliente. */
    @Transactional
    public ConsultaResponse responder(Long id, RespuestaRequest req) {
        Consulta consulta = buscar(id);
        if (consulta.getEstado() == EstadoConsulta.ARCHIVADA) {
            throw new ReglaNegocioException("No se puede responder una consulta archivada.");
        }
        consulta.setRespuesta(req.respuesta().trim());
        consulta.setEstado(EstadoConsulta.RESPONDIDA);
        consulta.setRespondidoEn(LocalDateTime.now());

        notificaciones.enviar(consulta.getCorreo(),
                "Respuesta a tu consulta #" + consulta.getId(),
                "Hola " + consulta.getNombre() + ",\n\n" + consulta.getRespuesta() + "\n\nFerretería Los Maestros");
        return ConsultaResponse.de(consulta);
    }

    @Transactional
    public ConsultaResponse cambiarEstado(Long id, EstadoRequest req) {
        Consulta consulta = buscar(id);
        if (req.estado() == EstadoConsulta.RESPONDIDA && consulta.getRespuesta() == null) {
            throw new ReglaNegocioException("Para marcarla como respondida usa PUT /api/contacto/{id}/respuesta.");
        }
        consulta.setEstado(req.estado());
        return ConsultaResponse.de(consulta);
    }

    @Transactional
    public void eliminar(Long id) {
        consultas.delete(buscar(id));
    }

    private Consulta buscar(Long id) {
        return consultas.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la consulta " + id + "."));
    }
}
