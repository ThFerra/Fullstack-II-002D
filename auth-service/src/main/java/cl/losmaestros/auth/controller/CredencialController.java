package cl.losmaestros.auth.controller;

import cl.losmaestros.auth.dto.*;
import cl.losmaestros.auth.security.UsuarioAutenticado;
import cl.losmaestros.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/credenciales")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Credenciales (Admin)", description = "Gestión de cuentas de acceso y roles. Solo ADMIN.")
@ApiResponses({
        @ApiResponse(responseCode = "401", description = "Sin sesión"),
        @ApiResponse(responseCode = "403", description = "El usuario no es ADMIN")
})
public class CredencialController {

    private final AuthService authService;

    public CredencialController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "Listar credenciales")
    @ApiResponse(responseCode = "200", description = "Listado")
    public List<CredencialResponse> listar() {
        return authService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una credencial")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrada"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public CredencialResponse obtener(@PathVariable Long id) {
        return authService.obtener(id);
    }

    @PutMapping("/{id}/rol")
    @Operation(summary = "Cambiar el rol (ADMIN / CLIENTE)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Rol actualizado"),
            @ApiResponse(responseCode = "400", description = "Rol inválido o intento de quitarse el rol a sí mismo"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public CredencialResponse cambiarRol(@PathVariable Long id, @Valid @RequestBody CambioRolRequest req,
                                         @AuthenticationPrincipal UsuarioAutenticado admin) {
        return authService.cambiarRol(id, req.rol(), admin.correo());
    }

    @PutMapping("/{id}/estado")
    @Operation(summary = "Activar o desactivar una cuenta")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "400", description = "Intento de desactivarse a sí mismo"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public CredencialResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstadoRequest req,
                                            @AuthenticationPrincipal UsuarioAutenticado admin) {
        return authService.cambiarEstado(id, req.activo(), admin.correo());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una credencial")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminada"),
            @ApiResponse(responseCode = "400", description = "Intento de eliminarse a sí mismo"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado admin) {
        authService.eliminar(id, admin.correo());
        return ResponseEntity.noContent().build();
    }
}
