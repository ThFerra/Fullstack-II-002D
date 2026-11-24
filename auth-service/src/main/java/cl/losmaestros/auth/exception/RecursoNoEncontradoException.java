package cl.losmaestros.auth.exception;

/** Se lanza cuando un registro buscado no existe (responde 404). */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
