package cl.losmaestros.carrito.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** Un carrito por usuario (identificado por el correo del token). */
@Entity
@Table(name = "carritos")
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_correo", nullable = false, unique = true, length = 100)
    private String usuarioCorreo;

    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<ItemCarrito> items = new ArrayList<>();

    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;

    @PrePersist
    @PreUpdate
    void alGuardar() {
        actualizadoEn = LocalDateTime.now();
    }

    public Carrito() {
    }

    public Carrito(String usuarioCorreo) {
        this.usuarioCorreo = usuarioCorreo;
    }

    public Optional<ItemCarrito> buscarItem(Long productoId) {
        return items.stream().filter(i -> i.getProductoId().equals(productoId)).findFirst();
    }

    public void agregarItem(ItemCarrito item) {
        item.setCarrito(this);
        items.add(item);
        tocar();
    }

    public void quitarItem(ItemCarrito item) {
        items.remove(item);
        tocar();
    }

    public void vaciar() {
        items.clear();
        tocar();
    }

    /** Fuerza la actualización de la fecha aunque solo cambien los ítems. */
    public void tocar() {
        actualizadoEn = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUsuarioCorreo() { return usuarioCorreo; }
    public List<ItemCarrito> getItems() { return items; }
    public LocalDateTime getActualizadoEn() { return actualizadoEn; }
}
