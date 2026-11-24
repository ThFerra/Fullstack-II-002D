package cl.losmaestros.auth.model;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * Token de renovación. Permite pedir un nuevo access token sin volver a escribir la contraseña.
 * Cada vez que se usa se revoca y se entrega uno nuevo (rotación).
 */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "credencial_id")
    private Credencial credencial;

    @Column(name = "expira_en", nullable = false)
    private Instant expiraEn;

    @Column(nullable = false)
    private boolean revocado = false;

    public RefreshToken() {
    }

    public RefreshToken(String token, Credencial credencial, Instant expiraEn) {
        this.token = token;
        this.credencial = credencial;
        this.expiraEn = expiraEn;
    }

    public boolean estaVigente() {
        return !revocado && expiraEn.isAfter(Instant.now());
    }

    public Long getId() { return id; }
    public String getToken() { return token; }
    public Credencial getCredencial() { return credencial; }
    public Instant getExpiraEn() { return expiraEn; }
    public boolean isRevocado() { return revocado; }
    public void setRevocado(boolean revocado) { this.revocado = revocado; }
}
