package cl.losmaestros.contenido.controller;

import cl.losmaestros.contenido.dto.NoticiaRequest;
import cl.losmaestros.contenido.dto.NoticiaResponse;
import cl.losmaestros.contenido.security.UsuarioAutenticado;
import cl.losmaestros.contenido.service.NoticiaService;
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
@RequestMapping("/api/noticias")
@Tag(name = "Noticias", description = "Sección Novedades de la tienda")
public class NoticiaController {

    private final NoticiaService servicio;

    public NoticiaController(NoticiaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar noticias publicadas (público)",
            description = "Con ?todas=true y token de ADMIN también devuelve las no publicadas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado"),
            @ApiResponse(responseCode = "403", description = "todas=true sin ser ADMIN")
    })
    public List<NoticiaResponse> listar(@RequestParam(defaultValue = "false") boolean todas,
                                        @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.listar(todas, usuario != null && usuario.esAdmin());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ver el detalle de una noticia (público)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrada"),
            @ApiResponse(responseCode = "404", description = "No existe o no está publicada")
    })
    public NoticiaResponse obtener(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.obtener(id, usuario != null && usuario.esAdmin());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear noticia (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Creada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "Sin sesión"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN")
    })
    public ResponseEntity<NoticiaResponse> crear(@Valid @RequestBody NoticiaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar noticia o cambiar si está publicada (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public NoticiaResponse actualizar(@PathVariable Long id, @Valid @RequestBody NoticiaRequest req) {
        return servicio.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar noticia (ADMIN)")
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
