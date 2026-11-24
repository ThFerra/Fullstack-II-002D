package cl.losmaestros.auth.service;

import cl.losmaestros.auth.dto.TokenResponse;
import cl.losmaestros.auth.model.Credencial;
import cl.losmaestros.auth.model.RefreshToken;
import cl.losmaestros.auth.repository.RefreshTokenRepository;
import cl.losmaestros.auth.security.JwtService;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

/**
 * Genera los tokens:
 * - access token (JWT firmado, dura pocos minutos) con el correo y el rol del usuario;
 * - refresh token (aleatorio, guardado en la base de datos) para renovar la sesión.
 */
@Service
public class TokenService {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshRepositorio;
    private final Duration duracionAccess;
    private final Duration duracionRefresh;

    public TokenService(JwtService jwtService,
                        RefreshTokenRepository refreshRepositorio,
                        @Value("${jwt.access-minutes}") long minutosAccess,
                        @Value("${jwt.refresh-days}") long diasRefresh) {
        this.jwtService = jwtService;
        this.refreshRepositorio = refreshRepositorio;
        this.duracionAccess = Duration.ofMinutes(minutosAccess);
        this.duracionRefresh = Duration.ofDays(diasRefresh);
    }

    public TokenResponse emitir(Credencial credencial) {
        Instant ahora = Instant.now();
        String accessToken = Jwts.builder()
                .id(UUID.randomUUID().toString())
                .issuer(jwtService.getEmisor())
                .subject(credencial.getCorreo())
                .claim("rol", credencial.getRol().name())
                .claim("tipo", "access")
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(duracionAccess)))
                .signWith(jwtService.getClave())
                .compact();

        RefreshToken refresh = new RefreshToken(
                UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""),
                credencial,
                ahora.plus(duracionRefresh));
        refreshRepositorio.save(refresh);

        return new TokenResponse(accessToken, refresh.getToken(), "Bearer",
                duracionAccess.toSeconds(), credencial.getCorreo(), credencial.getRol().name());
    }
}
