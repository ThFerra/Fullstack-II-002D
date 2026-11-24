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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Inicio de sesión, renovación de token y cierre de sesión")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Devuelve un access token JWT (15 min) y un refresh token (7 días).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sesión iniciada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "401", description = "Correo o contraseña incorrectos"),
            @ApiResponse(responseCode = "403", description = "Cuenta desactivada")
    })
    public TokenResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar sesión", description = "Entrega tokens nuevos usando el refresh token. El refresh token usado queda revocado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tokens renovados"),
            @ApiResponse(responseCode = "401", description = "Refresh token inválido, revocado o expirado")
    })
    public TokenResponse refresh(@Valid @RequestBody RefreshRequest req) {
        return authService.renovar(req);
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesión", description = "Revoca el refresh token para que no se pueda volver a usar.")
    @ApiResponse(responseCode = "200", description = "Sesión cerrada")
    public MensajeResponse logout(@Valid @RequestBody RefreshRequest req) {
        authService.cerrarSesion(req);
        return new MensajeResponse("Sesión cerrada.");
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Datos de la sesión actual", description = "Devuelve el correo y rol del token enviado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sesión válida"),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido o expirado")
    })
    public CredencialResponse me(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return authService.obtenerPorCorreo(usuario.correo());
    }

    @PutMapping("/password")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cambiar contraseña", description = "Requiere la contraseña actual. Cierra las demás sesiones.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contraseña actualizada"),
            @ApiResponse(responseCode = "400", description = "Contraseña actual incorrecta o nueva contraseña inválida"),
            @ApiResponse(responseCode = "401", description = "Sin sesión")
    })
    public MensajeResponse cambiarPassword(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                           @Valid @RequestBody CambioPasswordRequest req) {
        authService.cambiarPassword(usuario.correo(), req);
        return new MensajeResponse("Contraseña actualizada. Vuelve a iniciar sesión en tus otros dispositivos.");
    }
}
