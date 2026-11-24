package cl.losmaestros.carrito.dto;

import cl.losmaestros.carrito.model.ItemCarrito;

public record ItemResponse(Long productoId, String nombre, String imagen, Integer precioUnitario,
                           Integer cantidad, Integer subtotal) {

    public static ItemResponse de(ItemCarrito i) {
        return new ItemResponse(i.getProductoId(), i.getNombre(), i.getImagen(), i.getPrecioUnitario(),
                i.getCantidad(), i.subtotal());
    }
}
