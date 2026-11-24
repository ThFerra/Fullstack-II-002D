package cl.losmaestros.contacto.exception;

import org.springframework.http.HttpStatus;

/** Se lanza cuando una regla de negocio no se cumple (por defecto responde 400). */
public class ReglaNegocioException extends RuntimeException {

    private final HttpStatus status;

    public ReglaNegocioException(String mensaje) {
        this(HttpStatus.BAD_REQUEST, mensaje);
    }

    public ReglaNegocioException(HttpStatus status, String mensaje) {
        super(mensaje);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
