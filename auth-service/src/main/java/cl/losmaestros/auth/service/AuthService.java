package cl.losmaestros.auth.service;

import cl.losmaestros.auth.dto.*;
import cl.losmaestros.auth.exception.RecursoNoEncontradoException;
import cl.losmaestros.auth.exception.ReglaNegocioException;
import cl.losmaestros.auth.model.Credencial;
import cl.losmaestros.auth.model.RefreshToken;
import cl.losmaestros.auth.model.Rol;
import cl.losmaestros.auth.repository.CredencialRepository;
import cl.losmaestros.auth.repository.RefreshTokenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Lógica de negocio de autenticación y gestión de credenciales. */
@Service
public class AuthService {

    private static final String CREDENCIALES_INVALIDAS =
            "El correo o la contraseña no coinciden con una cuenta registrada.";

    private final CredencialRepository credenciales;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder encoder;
    private final TokenService tokenService;

    public AuthService(CredencialRepository credenciales, RefreshTokenRepository refreshTokens,
                       PasswordEncoder encoder, TokenService tokenService) {
        this.credenciales = credenciales;
        this.refreshTokens = refreshTokens;
        this.encoder = encoder;
        this.tokenService = tokenService;
    }

    // ---------- Sesión ----------

    @Transactional
    public TokenResponse login(LoginRequest req) {
        Credencial credencial = credenciales.findByCorreoIgnoreCase(req.correo().trim())
                .orElseThrow(() -> new ReglaNegocioException(HttpStatus.UNAUTHORIZED, CREDENCIALES_INVALIDAS));

        if (!encoder.matches(req.password(), credencial.getPasswordHash())) {
            throw new ReglaNegocioException(HttpStatus.UNAUTHORIZED, CREDENCIALES_INVALIDAS);
        }
        if (!credencial.isActivo()) {
            throw new ReglaNegocioException(HttpStatus.FORBIDDEN, "La cuenta está desactivada. Contacta al administrador.");
        }
        return tokenService.emitir(credencial);
    }

    /** Entrega tokens nuevos y revoca el refresh token usado (rotación). */
    @Transactional
    public TokenResponse renovar(RefreshRequest req) {
        RefreshToken actual = refreshTokens.findByToken(req.refreshToken())
                .orElseThrow(() -> new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "La sesión no es válida. Inicia sesión nuevamente."));

        if (!actual.estaVigente()) {
            throw new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "La sesión expiró. Inicia sesión nuevamente.");
        }
        Credencial credencial = actual.getCredencial();
        if (!credencial.isActivo()) {
            throw new ReglaNegocioException(HttpStatus.FORBIDDEN, "La cuenta está desactivada.");
        }
        actual.setRevocado(true);
        return tokenService.emitir(credencial);
    }

    @Transactional
    public void cerrarSesion(RefreshRequest req) {
        refreshTokens.findByToken(req.refreshToken()).ifPresent(t -> t.setRevocado(true));
    }

    @Transactional(readOnly = true)
    public CredencialResponse obtenerPorCorreo(String correo) {
        return CredencialResponse.de(buscarPorCorreo(correo));
    }

    @Transactional
    public void cambiarPassword(String correo, CambioPasswordRequest req) {
        Credencial credencial = buscarPorCorreo(correo);
        if (!encoder.matches(req.passwordActual(), credencial.getPasswordHash())) {
            throw new ReglaNegocioException("La contraseña actual no es correcta.");
        }
        ReglasPassword.validar(req.passwordNueva());
        credencial.setPasswordHash(encoder.encode(req.passwordNueva()));
        // Por seguridad, se cierran las demás sesiones abiertas.
        refreshTokens.revocarTodos(credencial);
    }

    // ---------- Administración (solo ADMIN) ----------

    @Transactional(readOnly = true)
    public List<CredencialResponse> listar() {
        return credenciales.findAll().stream().map(CredencialResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public CredencialResponse obtener(Long id) {
        return CredencialResponse.de(buscarPorId(id));
    }

    @Transactional
    public CredencialResponse cambiarRol(Long id, Rol rol, String correoAdmin) {
        Credencial credencial = buscarPorId(id);
        if (credencial.getCorreo().equalsIgnoreCase(correoAdmin) && rol != Rol.ADMIN) {
            throw new ReglaNegocioException("No puedes quitarte el rol de administrador a ti mismo.");
        }
        credencial.setRol(rol);
        refreshTokens.revocarTodos(credencial);
        return CredencialResponse.de(credencial);
    }

    @Transactional
    public CredencialResponse cambiarEstado(Long id, boolean activo, String correoAdmin) {
        Credencial credencial = buscarPorId(id);
        if (credencial.getCorreo().equalsIgnoreCase(correoAdmin) && !activo) {
            throw new ReglaNegocioException("No puedes desactivar tu propia cuenta.");
        }
        credencial.setActivo(activo);
        if (!activo) {
            refreshTokens.revocarTodos(credencial);
        }
        return CredencialResponse.de(credencial);
    }

    @Transactional
    public void eliminar(Long id, String correoAdmin) {
        Credencial credencial = buscarPorId(id);
        if (credencial.getCorreo().equalsIgnoreCase(correoAdmin)) {
            throw new ReglaNegocioException("No puedes eliminar tu propia cuenta.");
        }
        refreshTokens.eliminarDe(credencial);
        credenciales.delete(credencial);
    }

    // ---------- Llamadas internas (otros microservicios) ----------

    @Transactional
    public CredencialResponse crear(CrearCredencialRequest req) {
        String correo = req.correo().trim().toLowerCase();
        if (credenciales.existsByCorreoIgnoreCase(correo)) {
            throw new ReglaNegocioException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo.");
        }
        ReglasPassword.validar(req.password());
        Credencial nueva = credenciales.save(new Credencial(correo, encoder.encode(req.password()), req.rol()));
        return CredencialResponse.de(nueva);
    }

    @Transactional
    public CredencialResponse cambiarCorreo(CambioCorreoRequest req) {
        Credencial credencial = buscarPorCorreo(req.correoActual());
        String nuevo = req.correoNuevo().trim().toLowerCase();
        if (!credencial.getCorreo().equalsIgnoreCase(nuevo) && credenciales.existsByCorreoIgnoreCase(nuevo)) {
            throw new ReglaNegocioException(HttpStatus.CONFLICT, "Ese correo ya está asociado a otra cuenta.");
        }
        credencial.setCorreo(nuevo);
        refreshTokens.revocarTodos(credencial);
        return CredencialResponse.de(credencial);
    }

    @Transactional
    public void eliminarPorCorreo(String correo) {
        credenciales.findByCorreoIgnoreCase(correo).ifPresent(c -> {
            refreshTokens.eliminarDe(c);
            credenciales.delete(c);
        });
    }

    // ---------- Apoyo ----------

    private Credencial buscarPorId(Long id) {
        return credenciales.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la credencial con id " + id + "."));
    }

    private Credencial buscarPorCorreo(String correo) {
        return credenciales.findByCorreoIgnoreCase(correo.trim())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe una cuenta con el correo " + correo + "."));
    }
}
