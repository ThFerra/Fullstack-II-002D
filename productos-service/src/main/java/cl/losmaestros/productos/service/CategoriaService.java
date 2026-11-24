package cl.losmaestros.productos.service;

import cl.losmaestros.productos.dto.CategoriaRequest;
import cl.losmaestros.productos.dto.CategoriaResponse;
import cl.losmaestros.productos.exception.RecursoNoEncontradoException;
import cl.losmaestros.productos.exception.ReglaNegocioException;
import cl.losmaestros.productos.model.Categoria;
import cl.losmaestros.productos.repository.CategoriaRepository;
import cl.losmaestros.productos.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;

    public CategoriaService(CategoriaRepository categorias, ProductoRepository productos) {
        this.categorias = categorias;
        this.productos = productos;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categorias.findAll().stream().map(CategoriaResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtener(Long id) {
        return CategoriaResponse.de(buscar(id));
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest req) {
        String nombre = req.nombre().trim();
        if (categorias.existsByNombreIgnoreCase(nombre)) {
            throw new ReglaNegocioException(HttpStatus.CONFLICT, "Ya existe una categoría llamada " + nombre + ".");
        }
        return CategoriaResponse.de(categorias.save(new Categoria(nombre, req.descripcion())));
    }

    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest req) {
        Categoria categoria = buscar(id);
        String nombre = req.nombre().trim();
        categorias.findByNombreIgnoreCase(nombre).ifPresent(otra -> {
            if (!otra.getId().equals(id)) {
                throw new ReglaNegocioException(HttpStatus.CONFLICT, "Ya existe una categoría llamada " + nombre + ".");
            }
        });
        categoria.setNombre(nombre);
        categoria.setDescripcion(req.descripcion());
        return CategoriaResponse.de(categoria);
    }

    /** Regla de negocio: no se puede borrar una categoría que todavía tiene productos. */
    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = buscar(id);
        long cantidad = productos.countByCategoriaId(id);
        if (cantidad > 0) {
            throw new ReglaNegocioException(HttpStatus.CONFLICT,
                    "No se puede eliminar: la categoría tiene " + cantidad + " producto(s) asociados.");
        }
        categorias.delete(categoria);
    }

    Categoria buscar(Long id) {
        return categorias.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la categoría con id " + id + "."));
    }
}
