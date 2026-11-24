package cl.losmaestros.carrito.client;

import cl.losmaestros.carrito.exception.RecursoNoEncontradoException;
import cl.losmaestros.carrito.exception.ReglaNegocioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/** Consulta a productos-service (nombre y precio) e inventario-service (stock). */
@Component
public class CatalogoClient {

    private final RestClient productos;
    private final RestClient inventario;

    public CatalogoClient(RestClient.Builder builder,
                          @Value("${app.services.productos-url}") String productosUrl,
                          @Value("${app.services.inventario-url}") String inventarioUrl) {
        this.productos = builder.clone().baseUrl(productosUrl).build();
        this.inventario = builder.clone().baseUrl(inventarioUrl).build();
    }

    public ProductoInfo obtenerProducto(Long productoId) {
        try {
            return productos.get()
                    .uri("/api/productos/{id}", productoId)
                    .retrieve()
                    .body(ProductoInfo.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new RecursoNoEncontradoException("El producto " + productoId + " no existe.");
        } catch (RestClientException e) {
            throw new ReglaNegocioException(HttpStatus.SERVICE_UNAVAILABLE,
                    "El catálogo no está disponible en este momento. Intenta más tarde.");
        }
    }

    public DisponibilidadInfo consultarStock(Long productoId, int cantidad) {
        try {
            return inventario.get()
                    .uri("/api/inventario/{id}/disponibilidad?cantidad={cantidad}", productoId, cantidad)
                    .retrieve()
                    .body(DisponibilidadInfo.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ReglaNegocioException(HttpStatus.CONFLICT, "El producto " + productoId + " no tiene stock registrado.");
        } catch (RestClientException e) {
            throw new ReglaNegocioException(HttpStatus.SERVICE_UNAVAILABLE,
                    "El inventario no está disponible en este momento. Intenta más tarde.");
        }
    }
}
