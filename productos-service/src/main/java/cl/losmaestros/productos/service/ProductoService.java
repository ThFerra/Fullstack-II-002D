package cl.losmaestros.productos.service;

import cl.losmaestros.productos.client.InventarioClient;
import cl.losmaestros.productos.dto.ProductoRequest;
import cl.losmaestros.productos.dto.ProductoResponse;
import cl.losmaestros.productos.exception.RecursoNoEncontradoException;
import cl.losmaestros.productos.model.Producto;
import cl.losmaestros.productos.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productos;
    private final CategoriaService categoriaService;
    private final InventarioClient inventarioClient;

    public ProductoService(ProductoRepository productos, CategoriaService categoriaService,
                           InventarioClient inventarioClient) {
        this.productos = productos;
        this.categoriaService = categoriaService;
        this.inventarioClient = inventarioClient;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(String texto, Long categoriaId) {
        String filtro = (texto == null || texto.isBlank()) ? null : texto.trim();
        return productos.buscar(filtro, categoriaId).stream().map(ProductoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtener(Long id) {
        return ProductoResponse.de(buscar(id));
    }

    /** Crea el producto y registra su stock inicial en inventario-service. */
    @Transactional
    public ProductoResponse crear(ProductoRequest req) {
        Producto producto = new Producto();
        aplicar(producto, req);
        productos.saveAndFlush(producto);

        int stock = req.stockInicial() == null ? 0 : req.stockInicial();
        inventarioClient.crearStock(producto.getId(), stock);
        return ProductoResponse.de(producto);
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest req) {
        Producto producto = buscar(id);
        aplicar(producto, req);
        return ProductoResponse.de(producto);
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = buscar(id);
        productos.delete(producto);
        productos.flush();
        inventarioClient.eliminarStock(id);
    }

    private void aplicar(Producto producto, ProductoRequest req) {
        producto.setNombre(req.nombre().trim());
        producto.setDescripcion(req.descripcion() == null || req.descripcion().isBlank()
                ? "Producto agregado desde el panel administrativo."
                : req.descripcion().trim());
        producto.setPrecio(req.precio());
        producto.setImagen(req.imagen());
        producto.setCategoria(categoriaService.buscar(req.categoriaId()));
    }

    private Producto buscar(Long id) {
        return productos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el producto con id " + id + "."));
    }
}
