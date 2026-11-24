package cl.losmaestros.productos.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Map;

/**
 * Avisa a inventario-service cuando se crea o elimina un producto.
 * Si Inventario está caído, el producto igual se guarda y queda un aviso en el log
 * (el stock se puede cargar después desde Inventario).
 */
@Component
public class InventarioClient {

    private static final Logger log = LoggerFactory.getLogger(InventarioClient.class);

    private final RestClient restClient;

    public InventarioClient(RestClient.Builder builder,
                            @Value("${app.services.inventario-url}") String inventarioUrl,
                            @Value("${app.internal-key}") String claveInterna) {
        this.restClient = builder.clone()
                .baseUrl(inventarioUrl + "/api/inventario/internal")
                .defaultHeader("X-Internal-Key", claveInterna)
                .build();
    }

    public boolean crearStock(Long productoId, int cantidad) {
        try {
            restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("productoId", productoId, "cantidad", cantidad))
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (RestClientException e) {
            log.warn("No se pudo registrar el stock del producto {} en inventario-service: {}", productoId, e.getMessage());
            return false;
        }
    }

    public void eliminarStock(Long productoId) {
        try {
            restClient.delete().uri("/{productoId}", productoId).retrieve().toBodilessEntity();
        } catch (RestClientException e) {
            log.warn("No se pudo eliminar el stock del producto {} en inventario-service: {}", productoId, e.getMessage());
        }
    }
}
