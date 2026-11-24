package cl.losmaestros.inventario.dto;

import cl.losmaestros.inventario.model.MovimientoStock;

import java.time.LocalDateTime;

public record MovimientoResponse(Long id, Long productoId, String tipo, Integer cantidad, Integer stockResultante,
                                 String motivo, String usuario, LocalDateTime fecha) {

    public static MovimientoResponse de(MovimientoStock m) {
        return new MovimientoResponse(m.getId(), m.getProductoId(), m.getTipo().name(), m.getCantidad(),
                m.getStockResultante(), m.getMotivo(), m.getUsuario(), m.getFecha());
    }
}
