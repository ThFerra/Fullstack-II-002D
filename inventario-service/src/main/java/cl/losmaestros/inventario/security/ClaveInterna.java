package cl.losmaestros.inventario.security;

import cl.losmaestros.inventario.exception.ReglaNegocioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Protege los endpoints /internal: solo otros microservicios que conocen
 * la clave app.internal-key (cabecera X-Internal-Key) pueden llamarlos.
 */
@Component
public class ClaveInterna {

    public static final String CABECERA = "X-Internal-Key";

    private final byte[] clave;

    public ClaveInterna(@Value("${app.internal-key}") String clave) {
        this.clave = clave.getBytes(StandardCharsets.UTF_8);
    }

    public void validar(String recibida) {
        if (recibida == null || !MessageDigest.isEqual(clave, recibida.getBytes(StandardCharsets.UTF_8))) {
            throw new ReglaNegocioException(HttpStatus.FORBIDDEN, "Clave interna inválida.");
        }
    }
}
