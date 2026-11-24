package cl.losmaestros.productos.config;

import cl.losmaestros.productos.model.Categoria;
import cl.losmaestros.productos.model.Producto;
import cl.losmaestros.productos.repository.CategoriaRepository;
import cl.losmaestros.productos.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Carga los 8 productos del frontend la primera vez (base vacía).
 * Quedan con id 1 a 8, los mismos que usa inventario-service para su stock inicial.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;

    public DatosIniciales(CategoriaRepository categorias, ProductoRepository productos) {
        this.categorias = categorias;
        this.productos = productos;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productos.count() > 0) {
            return;
        }
        Map<String, Categoria> cat = new HashMap<>();
        for (String[] c : new String[][]{
                {"Construcción", "Cemento, áridos y materiales de obra."},
                {"Herramientas eléctricas", "Taladros, esmeriles y equipos eléctricos."},
                {"Herramientas manuales", "Martillos, alicates, destornilladores y llaves."},
                {"Gasfitería", "Llaves, conexiones y accesorios de agua."},
                {"Pinturas", "Pinturas, brochas y rodillos."},
                {"Fijaciones", "Tornillos, tarugos y clavos."}}) {
            cat.put(c[0], categorias.findByNombreIgnoreCase(c[0])
                    .orElseGet(() -> categorias.save(new Categoria(c[0], c[1]))));
        }

        crear("Saco Cemento Polpaico 25kg", "Construcción", 4890, "/img/images%20(1).jpg",
                "Cemento de alta resistencia para obra civil y remodelaciones.", cat);
        crear("Taladro Percutor 18V", "Herramientas eléctricas", 79990, "/img/Taladro-Percutor-Bosch-13mm-800w-Gsb-20-2-Re.webp",
                "Taladro de alto torque para perforación y impacto profesional.", cat);
        crear("Set Alicates Profesionales", "Herramientas manuales", 15990, "/img/8120020-set-de-alicates-ergonomicos-8-3-pcs-wellborn.jpg",
                "Set de alicates de precisión y uso intensivo en taller.", cat);
        crear("Llave Monomando Lavaplatos", "Gasfitería", 22990, "/img/D_NQ_NP_955306-MLC92240553458_092025-O.webp",
                "Llave para lavaplatos y conexiones de agua con alta durabilidad.", cat);
        crear("Martillo Galponero 16 oz", "Herramientas manuales", 8990, "/img/D_NQ_NP_608125-MLA99500492814_112025-O.webp",
                "Martillo resistente para trabajos de carpintería y obra.", cat);
        crear("Set de Destornilladores 6 piezas", "Herramientas manuales", 7490, "/img/w=1500,h=1500,fit=cover.jpg",
                "Completo juego de destornilladores para uso general y técnico.", cat);
        crear("Pintura Látex Blanca 1 galón", "Pinturas", 18990, "/img/w=1500,h=1500,fit=cover.webp",
                "Pintura interior/exterior para fachadas, habitaciones y acabados.", cat);
        crear("Caja de Tarugos y Tornillos", "Fijaciones", 5990, "/img/D_Q_NP_2X_698505-CBT112794574390_072026-T.webp",
                "Set de fijación esencial para obras y mantención doméstica.", cat);
    }

    private void crear(String nombre, String categoria, int precio, String imagen, String descripcion,
                       Map<String, Categoria> cat) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setCategoria(cat.get(categoria));
        p.setPrecio(precio);
        p.setImagen(imagen);
        p.setDescripcion(descripcion);
        productos.save(p);
    }
}
