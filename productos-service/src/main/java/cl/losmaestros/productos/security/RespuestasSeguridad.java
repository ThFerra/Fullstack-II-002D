package cl.losmaestros.productos.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import cl.losmaestros.productos.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/** Respuestas JSON para 401 (sin sesión) y 403 (sin permisos) generadas por Spring Security. */
@Component
public class RespuestasSeguridad {

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public AuthenticationEntryPoint noAutenticado() {
        return (request, response, ex) -> escribir(response, 401, "Unauthorized",
                "Debes iniciar sesión o tu token expiró.", request.getRequestURI());
    }

    public AccessDeniedHandler sinPermisos() {
        return (request, response, ex) -> escribir(response, 403, "Forbidden",
                "No tienes permisos para realizar esta acción.", request.getRequestURI());
    }

    private void escribir(HttpServletResponse response, int status, String error, String mensaje, String ruta)
            throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        mapper.writeValue(response.getWriter(), ErrorResponse.de(status, error, mensaje, ruta));
    }
}
