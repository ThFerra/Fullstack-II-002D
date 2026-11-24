package cl.losmaestros.inventario.config;

import cl.losmaestros.inventario.model.Stock;
import cl.losmaestros.inventario.repository.StockRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Stock inicial de los 8 productos que carga productos-service (ids 1 a 8), con las cantidades del frontend. */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final StockRepository stocks;

    public DatosIniciales(StockRepository stocks) {
        this.stocks = stocks;
    }

    @Override
    public void run(String... args) {
        if (stocks.count() > 0) {
            return;
        }
        int[] cantidades = {150, 12, 25, 8, 30, 42, 18, 65};
        for (int i = 0; i < cantidades.length; i++) {
            stocks.save(new Stock((long) (i + 1), cantidades[i]));
        }
    }
}
