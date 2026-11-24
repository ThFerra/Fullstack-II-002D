package cl.losmaestros.inventario.repository;

import cl.losmaestros.inventario.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByProductoId(Long productoId);

    @Query("select s from Stock s where s.cantidad <= s.stockMinimo order by s.cantidad")
    List<Stock> findCriticos();
}
