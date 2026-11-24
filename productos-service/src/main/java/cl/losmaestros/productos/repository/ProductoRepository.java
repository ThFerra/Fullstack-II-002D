package cl.losmaestros.productos.repository;

import cl.losmaestros.productos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /** Búsqueda opcional por texto (nombre o descripción) y por categoría. */
    @Query("""
            select p from Producto p
            where (:categoriaId is null or p.categoria.id = :categoriaId)
              and (:texto is null
                   or lower(p.nombre) like lower(concat('%', :texto, '%'))
                   or lower(p.descripcion) like lower(concat('%', :texto, '%')))
            order by p.id
            """)
    List<Producto> buscar(@Param("texto") String texto, @Param("categoriaId") Long categoriaId);

    long countByCategoriaId(Long categoriaId);
}
