package cl.losmaestros.carrito.model;

import jakarta.persistence.*;

/**
 * Producto dentro del carrito. Se guarda una copia del nombre y precio para mostrar el carrito
 * sin llamar a productos-service cada vez; se actualizan al modificar el ítem.
 */
@Entity
@Table(name = "items_carrito",
        uniqueConstraints = @UniqueConstraint(columnNames = {"carrito_id", "producto_id"}))
public class ItemCarrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "carrito_id")
    private Carrito carrito;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String imagen;

    @Column(name = "precio_unitario", nullable = false)
    private Integer precioUnitario;

    @Column(nullable = false)
    private Integer cantidad;

    public ItemCarrito() {
    }

    public ItemCarrito(Long productoId, String nombre, String imagen, Integer precioUnitario, Integer cantidad) {
        this.productoId = productoId;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
    }

    public int subtotal() {
        return precioUnitario * cantidad;
    }

    public Long getId() { return id; }
    public Carrito getCarrito() { return carrito; }
    public void setCarrito(Carrito carrito) { this.carrito = carrito; }
    public Long getProductoId() { return productoId; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public Integer getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Integer precioUnitario) { this.precioUnitario = precioUnitario; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
