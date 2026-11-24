package cl.losmaestros.auth.repository;

import cl.losmaestros.auth.model.Credencial;
import cl.losmaestros.auth.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("update RefreshToken r set r.revocado = true where r.credencial = :credencial and r.revocado = false")
    int revocarTodos(@Param("credencial") Credencial credencial);

    @Modifying
    @Query("delete from RefreshToken r where r.credencial = :credencial")
    void eliminarDe(@Param("credencial") Credencial credencial);
}
