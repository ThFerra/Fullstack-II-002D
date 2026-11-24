package cl.losmaestros.usuarios.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cl.losmaestros.usuarios.exception.ReglaNegocioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

/**
 * Comunicación con auth-service para crear, actualizar o eliminar las credenciales
 * de un usuario. Usa los endpoints /internal protegidos con X-Internal-Key.
 */
@Component
public class AuthClient {

    private static final String CABECERA_INTERNA = "X-Internal-Key";

    private final RestClient restClient;
    private final ObjectMapper mapper;

    public AuthClient(RestClient.Builder builder, ObjectMapper mapper,
                      @Value("${app.services.auth-url}") String authUrl,
                      @Value("${app.internal-key}") String claveInterna) {
        this.mapper = mapper;
        this.restClient = builder.clone()
                .baseUrl(authUrl + "/api/auth/internal/credenciales")
                .defaultHeader(CABECERA_INTERNA, claveInterna)
                .build();
    }

    public void crearCredencial(String correo, String password, String rol) {
        ejecutar(() -> restClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("correo", correo, "password", password, "rol", rol))
                .retrieve()
                .toBodilessEntity());
    }

    public void cambiarCorreo(String correoActual, String correoNuevo) {
        ejecutar(() -> restClient.put()
                .uri("/correo")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("correoActual", correoActual, "correoNuevo", correoNuevo))
                .retrieve()
                .toBodilessEntity());
    }

    public void eliminarCredencial(String correo) {
        ejecutar(() -> restClient.delete()
                .uri(uri -> uri.queryParam("correo", correo).build())
                .retrieve()
                .toBodilessEntity());
    }

    private void ejecutar(Runnable llamada) {
        try {
            llamada.run();
        } catch (RestClientResponseException e) {
            throw traducir(e);
        } catch (ResourceAccessException e) {
            throw new ReglaNegocioException(HttpStatus.SERVICE_UNAVAILABLE,
                    "El servicio de autenticación no está disponible. Intenta más tarde.");
        }
    }

    /** Reutiliza el mensaje de error que devolvió auth-service (por ejemplo, "Ya existe una cuenta con ese correo."). */
    private ReglaNegocioException traducir(RestClientResponseException e) {
        String mensaje = "Error al comunicarse con el servicio de autenticación.";
        try {
            JsonNode cuerpo = mapper.readTree(e.getResponseBodyAsString());
            if (cuerpo.hasNonNull("mensaje")) {
                mensaje = cuerpo.get("mensaje").asText();
            }
        } catch (Exception ignorada) {
            // el cuerpo no era JSON: se mantiene el mensaje genérico
        }
        HttpStatus status = HttpStatus.resolve(e.getStatusCode().value());
        if (status == null || !status.is4xxClientError()) {
            status = HttpStatus.BAD_GATEWAY;
        }
        return new ReglaNegocioException(status, mensaje);
    }
}
