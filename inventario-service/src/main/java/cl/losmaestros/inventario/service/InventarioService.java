package cl.losmaestros.inventario.service;

import cl.losmaestros.inventario.dto.*;
import cl.losmaestros.inventario.exception.RecursoNoEncontradoException;
import cl.losmaestros.inventario.exception.ReglaNegocioException;
import cl.losmaestros.inventario.model.MovimientoStock;
import cl.losmaestros.inventario.model.Stock;
import cl.losmaestros.inventario.model.TipoMovimiento;
import cl.losmaestros.inventario.repository.MovimientoStockRepository;
import cl.losmaestros.inventario.repository.StockRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Lógica de stock. Regla principal: el stock nunca puede quedar negativo
 * y no se puede pedir más de lo disponible (esto faltaba en el frontend).
 */
@Service
public class InventarioService {

    private final StockRepository stocks;
    private final MovimientoStockRepository movimientos;

    public InventarioService(StockRepository stocks, MovimientoStockRepository movimientos) {
        this.stocks = stocks;
        this.movimientos = movimientos;
    }

    @Transactional(readOnly = true)
    public List<StockResponse> listar() {
        return stocks.findAll().stream().map(StockResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<StockResponse> criticos() {
        return stocks.findCriticos().stream().map(StockResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public StockResponse obtener(Long productoId) {
        return StockResponse.de(buscar(productoId));
    }

    @Transactional(readOnly = true)
    public DisponibilidadResponse disponibilidad(Long productoId, int cantidad) {
        if (cantidad < 1) {
            throw new ReglaNegocioException("La cantidad debe ser al menos 1.");
        }
        Stock stock = buscar(productoId);
        return new DisponibilidadResponse(productoId, cantidad, stock.getCantidad(), stock.getCantidad() >= cantidad);
    }

    @Transactional
    public StockResponse ajustar(Long productoId, AjusteStockRequest req, String usuario) {
        Stock stock = stocks.findByProductoId(productoId).orElseGet(() -> new Stock(productoId, 0));
        stock.setCantidad(req.cantidad());
        if (req.stockMinimo() != null) {
            stock.setStockMinimo(req.stockMinimo());
        }
        stocks.save(stock);
        registrar(productoId, TipoMovimiento.AJUSTE, req.cantidad(), stock.getCantidad(), req.motivo(), usuario);
        return StockResponse.de(stock);
    }

    @Transactional
    public StockResponse entrada(Long productoId, MovimientoRequest req, String usuario) {
        Stock stock = buscar(productoId);
        stock.setCantidad(stock.getCantidad() + req.cantidad());
        registrar(productoId, TipoMovimiento.ENTRADA, req.cantidad(), stock.getCantidad(), req.motivo(), usuario);
        return StockResponse.de(stock);
    }

    @Transactional
    public StockResponse salida(Long productoId, MovimientoRequest req, String usuario) {
        Stock stock = buscar(productoId);
        if (stock.getCantidad() < req.cantidad()) {
            throw new ReglaNegocioException(HttpStatus.CONFLICT,
                    "Stock insuficiente: hay " + stock.getCantidad() + " unidad(es) y se pidieron " + req.cantidad() + ".");
        }
        stock.setCantidad(stock.getCantidad() - req.cantidad());
        registrar(productoId, TipoMovimiento.SALIDA, req.cantidad(), stock.getCantidad(), req.motivo(), usuario);
        return StockResponse.de(stock);
    }

    @Transactional(readOnly = true)
    public List<MovimientoResponse> movimientos(Long productoId) {
        buscar(productoId);
        return movimientos.findByProductoIdOrderByFechaDesc(productoId).stream().map(MovimientoResponse::de).toList();
    }

    @Transactional
    public void eliminar(Long productoId) {
        Stock stock = buscar(productoId);
        movimientos.deleteByProductoId(productoId);
        stocks.delete(stock);
    }

    /** Llamado por productos-service al crear un producto. Si ya existía stock, lo reemplaza. */
    @Transactional
    public StockResponse crearDesdeProductos(CrearStockRequest req) {
        Stock stock = stocks.findByProductoId(req.productoId()).orElseGet(() -> new Stock(req.productoId(), 0));
        stock.setCantidad(req.cantidad());
        stocks.save(stock);
        registrar(req.productoId(), TipoMovimiento.AJUSTE, req.cantidad(), stock.getCantidad(),
                "Stock inicial al crear el producto", "productos-service");
        return StockResponse.de(stock);
    }

    @Transactional
    public void eliminarDesdeProductos(Long productoId) {
        stocks.findByProductoId(productoId).ifPresent(stock -> {
            movimientos.deleteByProductoId(productoId);
            stocks.delete(stock);
        });
    }

    private void registrar(Long productoId, TipoMovimiento tipo, int cantidad, int resultante, String motivo, String usuario) {
        movimientos.save(new MovimientoStock(productoId, tipo, cantidad, resultante, motivo, usuario));
    }

    private Stock buscar(Long productoId) {
        return stocks.findByProductoId(productoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No hay stock registrado para el producto " + productoId + "."));
    }
}
