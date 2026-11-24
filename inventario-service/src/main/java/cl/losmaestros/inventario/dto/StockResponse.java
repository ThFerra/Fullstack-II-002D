package cl.losmaestros.inventario.dto;

import cl.losmaestros.inventario.model.Stock;

import java.time.LocalDateTime;

public record StockResponse(Long productoId, Integer cantidad, Integer stockMinimo, boolean critico,
                            LocalDateTime actualizadoEn) {

    public static StockResponse de(Stock s) {
        return new StockResponse(s.getProductoId(), s.getCantidad(), s.getStockMinimo(), s.esCritico(), s.getActualizadoEn());
    }
}
