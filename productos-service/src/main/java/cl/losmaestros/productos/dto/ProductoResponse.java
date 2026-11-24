package cl.losmaestros.productos.dto;

import cl.losmaestros.productos.model.Producto;

public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        Integer precio,
        String imagen,
        Long categoriaId,
        String categoria
) {

    public static ProductoResponse de(Producto p) {
        return new ProductoResponse(p.getId(), p.getNombre(), p.getDescripcion(), p.getPrecio(), p.getImagen(),
                p.getCategoria().getId(), p.getCategoria().getNombre());
    }
}
