package cl.losmaestros.carrito.dto;

import cl.losmaestros.carrito.model.Carrito;

import java.util.List;

/** Lo que muestra el panel "Mi selección / pedido" del frontend. */
public record CarritoResponse(String usuario, List<ItemResponse> items, int totalUnidades, int total) {

    public static CarritoResponse de(Carrito c) {
        List<ItemResponse> items = c.getItems().stream().map(ItemResponse::de).toList();
        int unidades = items.stream().mapToInt(ItemResponse::cantidad).sum();
        int total = items.stream().mapToInt(ItemResponse::subtotal).sum();
        return new CarritoResponse(c.getUsuarioCorreo(), items, unidades, total);
    }

    public static CarritoResponse vacio(String correo) {
        return new CarritoResponse(correo, List.of(), 0, 0);
    }
}
