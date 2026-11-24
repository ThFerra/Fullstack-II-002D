package cl.losmaestros.contacto.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Verifica los tokens JWT emitidos por auth-service.
 * Todos los microservicios comparten la misma clave secreta (jwt.secret),
 * por eso cada uno puede validar el token sin llamar a auth-service.
 */
@Service
public class JwtService {

    private final SecretKey clave;
    private final String emisor;

    public JwtService(@Value("${jwt.secret}") String secreto, @Value("${jwt.issuer}") String emisor) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.emisor = emisor;
    }

    /** Devuelve los datos del token o lanza JwtException si es inválido, fue alterado o expiró. */
    public Claims validar(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .requireIssuer(emisor)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public SecretKey getClave() {
        return clave;
    }

    public String getEmisor() {
        return emisor;
    }
}
