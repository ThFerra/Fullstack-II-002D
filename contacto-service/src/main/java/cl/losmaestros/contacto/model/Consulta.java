package cl.losmaestros.contacto.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/** Consulta enviada desde el formulario "Escríbenos". */
@Entity
@Table(name = "consultas")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String correo;

    @Column(nullable = false, length = 500)
    private String mensaje;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private EstadoConsulta estado = EstadoConsulta.PENDIENTE;

    @Column(length = 1000)
    private String respuesta;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "respondido_en")
    private LocalDateTime respondidoEn;

    @PrePersist
    void alCrear() {
        creadoEn = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public EstadoConsulta getEstado() { return estado; }
    public void setEstado(EstadoConsulta estado) { this.estado = estado; }
    public String getRespuesta() { return respuesta; }
    public void setRespuesta(String respuesta) { this.respuesta = respuesta; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
    public LocalDateTime getRespondidoEn() { return respondidoEn; }
    public void setRespondidoEn(LocalDateTime respondidoEn) { this.respondidoEn = respondidoEn; }
}
