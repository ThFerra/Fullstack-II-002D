package cl.losmaestros.inventario.dto;

/** Respuesta que usa carrito-service antes de agregar un producto. */
public record DisponibilidadResponse(Long productoId, int cantidadSolicitada, int stockActual, boolean disponible) {
}
