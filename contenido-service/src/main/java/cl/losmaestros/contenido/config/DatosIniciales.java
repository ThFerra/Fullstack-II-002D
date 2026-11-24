package cl.losmaestros.contenido.config;

import cl.losmaestros.contenido.model.Noticia;
import cl.losmaestros.contenido.repository.NoticiaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Las 4 noticias que tenía el frontend en items/index.ts. */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final NoticiaRepository noticias;

    public DatosIniciales(NoticiaRepository noticias) {
        this.noticias = noticias;
    }

    @Override
    public void run(String... args) {
        if (noticias.count() > 0) {
            return;
        }
        crear("Novedad de Brocas", "/img/images%20(3).jpg", "Tipos de brocas para madera, metal y concreto",
                "Descubre la nueva línea de brocas para metal, madera y concreto con mejor duración.",
                "Elige la broca según el material que necesitas perforar: las brocas para madera ayudan a lograr cortes limpios, "
                        + "las de metal están diseñadas para trabajar superficies metálicas y las de concreto sirven para trabajos de albañilería. "
                        + "Si tienes dudas, nuestro equipo puede orientarte para escoger la adecuada.");
        crear("Catálogo y stock actualizado", "/img/images%20(2).jpg",
                "Ilustración de catálogo, inventario y búsqueda de productos",
                "Consulta nuestro catálogo para encontrar productos y revisar la disponibilidad para tu próximo proyecto.",
                "En el catálogo puedes revisar los productos disponibles, sus categorías, precios y stock registrado. "
                        + "Agrega los artículos que te interesan a tu selección y revisa el total antes de contactarnos para coordinar tu compra.");
        crear("Protección para tus proyectos", "/img/D_NQ_NP_807165-MLM105543785741_012026-O.webp",
                "Guantes de protección para trabajos de ferretería",
                "Encuentra guantes de trabajo para proteger tus manos durante tareas de construcción y mantención.",
                "Usar protección adecuada ayuda a reducir riesgos durante trabajos de construcción, reparación y mantención. "
                        + "Escoge guantes de acuerdo con la tarea y el material que vas a manipular; nuestro equipo puede ayudarte a encontrar una opción apropiada.");
        crear("Fijaciones para cada trabajo", "/img/D_Q_NP_2X_698505-CBT112794574390_072026-T.webp",
                "Caja organizadora con tornillos y fijaciones",
                "Tenemos surtidos de tornillos y fijaciones para reparaciones y proyectos de obra.",
                "Los tornillos, tarugos y otras fijaciones se deben elegir según el tipo de superficie y el peso que deben soportar. "
                        + "Revisa las opciones del catálogo y consúltanos si necesitas ayuda para encontrar la fijación adecuada para tu proyecto.");
    }

    private void crear(String titulo, String imagen, String alt, String resumen, String detalle) {
        Noticia n = new Noticia();
        n.setTitulo(titulo);
        n.setImagen(imagen);
        n.setImagenAlt(alt);
        n.setResumen(resumen);
        n.setDetalle(detalle);
        noticias.save(n);
    }
}
