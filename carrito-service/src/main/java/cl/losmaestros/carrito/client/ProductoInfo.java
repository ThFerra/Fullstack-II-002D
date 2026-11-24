package cl.losmaestros.carrito.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/** Datos que carrito-service necesita de productos-service. */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ProductoInfo(Long id, String nombre, Integer precio, String imagen) {
}
