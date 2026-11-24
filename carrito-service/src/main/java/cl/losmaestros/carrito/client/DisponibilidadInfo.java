package cl.losmaestros.carrito.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/** Respuesta de inventario-service: GET /api/inventario/{id}/disponibilidad. */
@JsonIgnoreProperties(ignoreUnknown = true)
public record DisponibilidadInfo(Long productoId, int cantidadSolicitada, int stockActual, boolean disponible) {
}
