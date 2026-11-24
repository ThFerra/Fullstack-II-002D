package cl.losmaestros.carrito.service;

import cl.losmaestros.carrito.client.CatalogoClient;
import cl.losmaestros.carrito.client.DisponibilidadInfo;
import cl.losmaestros.carrito.client.ProductoInfo;
import cl.losmaestros.carrito.dto.AgregarItemRequest;
import cl.losmaestros.carrito.dto.CambiarCantidadRequest;
import cl.losmaestros.carrito.dto.CarritoResponse;
import cl.losmaestros.carrito.exception.RecursoNoEncontradoException;
import cl.losmaestros.carrito.exception.ReglaNegocioException;
import cl.losmaestros.carrito.model.Carrito;
import cl.losmaestros.carrito.model.ItemCarrito;
import cl.losmaestros.carrito.repository.CarritoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Lógica del carrito. Regla principal: no se pueden tener en el carrito más unidades
 * de las que hay en stock (se consulta a inventario-service en cada cambio).
 */
@Service
public class CarritoService {

    private final CarritoRepository carritos;
    private final CatalogoClient catalogo;

    public CarritoService(CarritoRepository carritos, CatalogoClient catalogo) {
        this.carritos = carritos;
        this.catalogo = catalogo;
    }

    @Transactional(readOnly = true)
    public CarritoResponse obtener(String correo) {
        return carritos.findByUsuarioCorreo(correo)
                .map(CarritoResponse::de)
                .orElseGet(() -> CarritoResponse.vacio(correo));
    }

    @Transactional
    public CarritoResponse agregar(String correo, AgregarItemRequest req) {
        Carrito carrito = carritos.findByUsuarioCorreo(correo).orElseGet(() -> carritos.save(new Carrito(correo)));
        ItemCarrito existente = carrito.buscarItem(req.productoId()).orElse(null);
        int enCarrito = existente == null ? 0 : existente.getCantidad();
        int nuevaCantidad = enCarrito + req.cantidad();

        validarStock(req.productoId(), nuevaCantidad, enCarrito);
        ProductoInfo producto = catalogo.obtenerProducto(req.productoId());

        if (existente == null) {
            carrito.agregarItem(new ItemCarrito(producto.id(), producto.nombre(), producto.imagen(),
                    producto.precio(), nuevaCantidad));
        } else {
            actualizarItem(existente, producto, nuevaCantidad);
            carrito.tocar();
        }
        return CarritoResponse.de(carritos.save(carrito));
    }

    @Transactional
    public CarritoResponse cambiarCantidad(String correo, Long productoId, CambiarCantidadRequest req) {
        Carrito carrito = buscarCarrito(correo);
        ItemCarrito item = buscarItem(carrito, productoId);

        if (req.cantidad() > item.getCantidad()) {
            validarStock(productoId, req.cantidad(), item.getCantidad());
        }
        actualizarItem(item, catalogo.obtenerProducto(productoId), req.cantidad());
        carrito.tocar();
        return CarritoResponse.de(carrito);
    }

    @Transactional
    public CarritoResponse quitar(String correo, Long productoId) {
        Carrito carrito = buscarCarrito(correo);
        carrito.quitarItem(buscarItem(carrito, productoId));
        return CarritoResponse.de(carrito);
    }

    @Transactional
    public CarritoResponse vaciar(String correo) {
        return carritos.findByUsuarioCorreo(correo)
                .map(carrito -> {
                    carrito.vaciar();
                    return CarritoResponse.de(carrito);
                })
                .orElseGet(() -> CarritoResponse.vacio(correo));
    }

    private void validarStock(Long productoId, int cantidadTotal, int yaEnCarrito) {
        DisponibilidadInfo stock = catalogo.consultarStock(productoId, cantidadTotal);
        if (!stock.disponible()) {
            String detalle = yaEnCarrito > 0 ? " y ya tienes " + yaEnCarrito + " en tu carrito" : "";
            throw new ReglaNegocioException(HttpStatus.CONFLICT,
                    "Stock insuficiente: quedan " + stock.stockActual() + " unidad(es)" + detalle + ".");
        }
    }

    private void actualizarItem(ItemCarrito item, ProductoInfo producto, int cantidad) {
        item.setCantidad(cantidad);
        item.setNombre(producto.nombre());
        item.setImagen(producto.imagen());
        item.setPrecioUnitario(producto.precio());
    }

    private Carrito buscarCarrito(String correo) {
        return carritos.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RecursoNoEncontradoException("Tu carrito está vacío."));
    }

    private ItemCarrito buscarItem(Carrito carrito, Long productoId) {
        return carrito.buscarItem(productoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("El producto " + productoId + " no está en tu carrito."));
    }
}
