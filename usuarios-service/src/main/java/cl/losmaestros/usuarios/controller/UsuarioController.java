package cl.losmaestros.usuarios.controller;

import cl.losmaestros.usuarios.dto.*;
import cl.losmaestros.usuarios.security.UsuarioAutenticado;
import cl.losmaestros.usuarios.service.UsuarioService;
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
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Registro, perfil y administración de usuarios")
public class UsuarioController {

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/registro")
    @Operation(summary = "Registrar un cliente (público)",
            description = "Valida RUN, correo, teléfono, región/comuna y contraseña. Crea el perfil y la credencial con rol CLIENTE.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Cuenta creada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "409", description = "Correo o RUN ya registrados"),
            @ApiResponse(responseCode = "503", description = "auth-service no disponible")
    })
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegistroRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.registrar(req));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Ver mi perfil")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil del usuario con sesión"),
            @ApiResponse(responseCode = "401", description = "Sin sesión"),
            @ApiResponse(responseCode = "404", description = "La cuenta no tiene perfil")
    })
    public UsuarioResponse miPerfil(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.obtenerPorCorreo(usuario.correo());
    }

    @PutMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar mi perfil",
            description = "Si se cambia el correo, el token actual deja de servir y hay que iniciar sesión de nuevo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "Sin sesión"),
            @ApiResponse(responseCode = "409", description = "El correo ya está en uso")
    })
    public UsuarioResponse actualizarMiPerfil(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                              @Valid @RequestBody PerfilRequest req) {
        return servicio.actualizarPerfil(usuario.correo(), req);
    }

    // ---------- ADMIN ----------

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar usuarios (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado"),
            @ApiResponse(responseCode = "401", description = "Sin sesión"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN")
    })
    public List<UsuarioResponse> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Obtener un usuario (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrado"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public UsuarioResponse obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear un usuario con su rol (ADMIN)", description = "Requiere password y rol (ADMIN o CLIENTE).")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "409", description = "Correo o RUN ya registrados")
    })
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioAdminRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar un usuario (ADMIN)", description = "El rol se cambia en auth-service: PUT /api/auth/credenciales/{id}/rol.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe"),
            @ApiResponse(responseCode = "409", description = "Correo o RUN ya registrados")
    })
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioAdminRequest req) {
        return servicio.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar un usuario y su credencial (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminado"),
            @ApiResponse(responseCode = "400", description = "Intento de eliminarse a sí mismo"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado admin) {
        servicio.eliminar(id, admin.correo());
        return ResponseEntity.noContent().build();
    }
}
