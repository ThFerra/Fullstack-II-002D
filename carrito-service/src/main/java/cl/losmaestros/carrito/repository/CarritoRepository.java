package cl.losmaestros.carrito.repository;

import cl.losmaestros.carrito.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByUsuarioCorreo(String usuarioCorreo);
}
