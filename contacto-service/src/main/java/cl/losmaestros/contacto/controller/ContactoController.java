package cl.losmaestros.contacto.controller;

import cl.losmaestros.contacto.dto.*;
import cl.losmaestros.contacto.model.EstadoConsulta;
import cl.losmaestros.contacto.security.UsuarioAutenticado;
import cl.losmaestros.contacto.service.ConsultaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacto")
@Tag(name = "Contacto", description = "Consultas del formulario Escríbenos")
public class ContactoController {

    private final ConsultaService servicio;

    public ContactoController(ConsultaService servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    @Operation(summary = "Enviar una consulta (público)",
            description = "Guarda la consulta, envía acuse de recibo al cliente y aviso al administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Consulta enviada"),
            @ApiResponse(responseCode = "400", description = "Nombre, correo o mensaje inválidos")
    })
    public ResponseEntity<ConsultaCreadaResponse> enviar(@Valid @RequestBody ConsultaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(req));
    }

    @GetMapping("/mias")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Mis consultas y sus respuestas", description = "Consultas enviadas con el correo de la sesión.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado"),
            @ApiResponse(responseCode = "401", description = "Sin sesión")
    })
    public List<ConsultaResponse> mias(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.deUsuario(usuario.correo());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar consultas (ADMIN)", description = "Filtro opcional por estado: PENDIENTE, RESPONDIDA o ARCHIVADA.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado"),
            @ApiResponse(responseCode = "401", description = "Sin sesión"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN")
    })
    public List<ConsultaResponse> listar(@RequestParam(required = false) EstadoConsulta estado) {
        return servicio.listar(estado);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Ver una consulta (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrada"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public ConsultaResponse obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @PutMapping("/{id}/respuesta")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Responder una consulta (ADMIN)", description = "Marca la consulta como RESPONDIDA y notifica al cliente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Respondida"),
            @ApiResponse(responseCode = "400", description = "Respuesta vacía o consulta archivada"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public ConsultaResponse responder(@PathVariable Long id, @Valid @RequestBody RespuestaRequest req) {
        return servicio.responder(id, req);
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cambiar el estado de una consulta (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "400", description = "Estado inválido"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public ConsultaResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest req) {
        return servicio.cambiarEstado(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar una consulta (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminada"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
