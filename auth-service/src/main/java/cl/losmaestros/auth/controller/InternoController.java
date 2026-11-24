package cl.losmaestros.auth.controller;

import cl.losmaestros.auth.dto.CambioCorreoRequest;
import cl.losmaestros.auth.dto.CrearCredencialRequest;
import cl.losmaestros.auth.dto.CredencialResponse;
import cl.losmaestros.auth.security.ClaveInterna;
import cl.losmaestros.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints que usa usuarios-service para mantener las credenciales sincronizadas
 * con los perfiles. Requieren la cabecera X-Internal-Key.
 */
@RestController
@RequestMapping("/api/auth/internal/credenciales")
@Tag(name = "Interno", description = "Uso exclusivo entre microservicios (cabecera X-Internal-Key)")
public class InternoController {

    private final AuthService authService;
    private final ClaveInterna claveInterna;

    public InternoController(AuthService authService, ClaveInterna claveInterna) {
        this.authService = authService;
        this.claveInterna = claveInterna;
    }

    @PostMapping
    @Operation(summary = "Crear credencial (registro de usuario)")
    public ResponseEntity<CredencialResponse> crear(@RequestHeader(ClaveInterna.CABECERA) String clave,
                                                    @Valid @RequestBody CrearCredencialRequest req) {
        claveInterna.validar(clave);
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.crear(req));
    }

    @PutMapping("/correo")
    @Operation(summary = "Cambiar el correo de una credencial")
    public CredencialResponse cambiarCorreo(@RequestHeader(ClaveInterna.CABECERA) String clave,
                                            @Valid @RequestBody CambioCorreoRequest req) {
        claveInterna.validar(clave);
        return authService.cambiarCorreo(req);
    }

    @DeleteMapping
    @Operation(summary = "Eliminar la credencial de un correo")
    public ResponseEntity<Void> eliminar(@RequestHeader(ClaveInterna.CABECERA) String clave,
                                         @RequestParam String correo) {
        claveInterna.validar(clave);
        authService.eliminarPorCorreo(correo);
        return ResponseEntity.noContent().build();
    }
}
