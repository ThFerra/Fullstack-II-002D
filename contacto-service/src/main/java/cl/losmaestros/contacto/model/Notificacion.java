package cl.losmaestros.contacto.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Registro de cada correo que el sistema "envía".
 * En este proyecto el envío es simulado (se guarda y se escribe en el log);
 * para enviar correos reales se reemplaza NotificacionService por uno con JavaMailSender.
 */
@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String destinatario;

    @Column(nullable = false, length = 150)
    private String asunto;

    @Column(nullable = false, length = 2000)
    private String cuerpo;

    @Column(name = "enviado_en", nullable = false)
    private LocalDateTime enviadoEn;

    @PrePersist
    void alCrear() {
        enviadoEn = LocalDateTime.now();
    }

    public Notificacion() {
    }

    public Notificacion(String destinatario, String asunto, String cuerpo) {
        this.destinatario = destinatario;
        this.asunto = asunto;
        this.cuerpo = cuerpo;
    }

    public Long getId() { return id; }
    public String getDestinatario() { return destinatario; }
    public String getAsunto() { return asunto; }
    public String getCuerpo() { return cuerpo; }
    public LocalDateTime getEnviadoEn() { return enviadoEn; }
}
