package cl.losmaestros.inventario.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/** Unidades disponibles de un producto. productoId es el id que asigna productos-service. */
@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id", nullable = false, unique = true)
    private Long productoId;

    @Column(nullable = false)
    private Integer cantidad;

    /** Bajo este valor el producto se considera crítico (hay que reponer). */
    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 5;

    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;

    @PrePersist
    @PreUpdate
    void alGuardar() {
        actualizadoEn = LocalDateTime.now();
    }

    public Stock() {
    }

    public Stock(Long productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }

    public boolean esCritico() {
        return cantidad <= stockMinimo;
    }

    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }
    public LocalDateTime getActualizadoEn() { return actualizadoEn; }
}
