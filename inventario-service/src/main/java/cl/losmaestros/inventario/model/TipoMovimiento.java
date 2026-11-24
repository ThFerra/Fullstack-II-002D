package cl.losmaestros.inventario.model;

public enum TipoMovimiento {
    /** Llega mercadería: suma stock. */
    ENTRADA,
    /** Venta o retiro: resta stock. */
    SALIDA,
    /** Corrección manual: fija el stock en un valor. */
    AJUSTE
}
