package cl.losmaestros.inventario.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/** Historial de cada cambio de stock: quién lo hizo, cuánto y por qué. */
@Entity
@Table(name = "movimientos_stock")
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoMovimiento tipo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "stock_resultante", nullable = false)
    private Integer stockResultante;

    @Column(length = 200)
    private String motivo;

    @Column(length = 100)
    private String usuario;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @PrePersist
    void alCrear() {
        fecha = LocalDateTime.now();
    }

    public MovimientoStock() {
    }

    public MovimientoStock(Long productoId, TipoMovimiento tipo, Integer cantidad, Integer stockResultante,
                           String motivo, String usuario) {
        this.productoId = productoId;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.stockResultante = stockResultante;
        this.motivo = motivo;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public TipoMovimiento getTipo() { return tipo; }
    public Integer getCantidad() { return cantidad; }
    public Integer getStockResultante() { return stockResultante; }
    public String getMotivo() { return motivo; }
    public String getUsuario() { return usuario; }
    public LocalDateTime getFecha() { return fecha; }
}
