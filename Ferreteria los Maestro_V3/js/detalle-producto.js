document.addEventListener('DOMContentLoaded', () => {
    // Productos
    const productos = [
        {
            id: 1,
            nombre: 'Saco Cemento Polpaico 25kg',
            categoria: 'Construcción',
            precio: 4890,
            stock: 150,
            img: 'imagenes/images (1).jpg',
            descripcion: 'Cemento de uso general para obras, reparaciones y proyectos de construcción.'
        },
        {
            id: 2,
            nombre: 'Taladro Percutor 18V',
            categoria: 'Herramientas eléctricas',
            precio: 79990,
            stock: 12,
            img: 'imagenes/Taladro-Percutor-Bosch-13mm-800w-Gsb-20-2-Re.webp',
            descripcion: 'Taladro percutor para trabajos de perforación en madera, metal y superficies de construcción.'
        },
        {
            id: 3,
            nombre: 'Set Alicates Profesionales',
            categoria: 'Herramientas manuales',
            precio: 15990,
            stock: 25,
            img: 'imagenes/8120020-set-de-alicates-ergonomicos-8-3-pcs-wellborn.jpg',
            descripcion: 'Set de alicates ergonómicos para corte, sujeción y trabajos de precisión.'
        },
        {
            id: 4,
            nombre: 'Llave Monomando Lavaplatos',
            categoria: 'Gasfitería',
            precio: 22990,
            stock: 8,
            img: 'imagenes/D_NQ_NP_955306-MLC92240553458_092025-O.webp',
            descripcion: 'Llave monomando práctica y resistente para renovar la instalación de tu cocina.'
        },
        {
            id: 5,
            nombre: 'Martillo Galponero 16 oz',
            categoria: 'Herramientas manuales',
            precio: 8990,
            stock: 30,
            img: 'imagenes/D_NQ_NP_608125-MLA99500492814_112025-O.webp',
            descripcion: 'Martillo firme y equilibrado para trabajos generales de reparación y montaje.'
        },
        {
            id: 6,
            nombre: 'Set de Destornilladores 6 piezas',
            categoria: 'Herramientas manuales',
            precio: 7490,
            stock: 42,
            img: 'imagenes/w=1500,h=1500,fit=cover.jpg',
            descripcion: 'Set de puntas y mangos para realizar ajustes en distintos tipos de tornillos.'
        },
        {
            id: 7,
            nombre: 'Pintura Látex Blanca 1 galón',
            categoria: 'Pinturas',
            precio: 18990,
            stock: 18,
            img: 'imagenes/w=1500,h=1500,fit=cover.webp',
            descripcion: 'Pintura látex blanca para interiores, ideal para renovar y proteger tus espacios.'
        },
        {
            id: 8,
            nombre: 'Caja de Tarugos y Tornillos',
            categoria: 'Fijaciones',
            precio: 5990,
            stock: 65,
            img: 'imagenes/D_Q_NP_2X_698505-CBT112794574390_072026-T.webp',
            descripcion: 'Surtido práctico de fijaciones para instalaciones y reparaciones del hogar.'
        },
        {
            id: 9,
            nombre: 'Guantes de Seguridad Antideslizantes',
            categoria: 'Seguridad',
            precio: 3990,
            stock: 80,
            img: 'imagenes/D_NQ_NP_807165-MLM105543785741_012026-O.webp',
            descripcion: 'Guantes con agarre antideslizante para proteger las manos durante el trabajo.'
        },
        {
            id: 10,
            nombre: 'Extensión Eléctrica 10 metros',
            categoria: 'Electricidad',
            precio: 12990,
            stock: 20,
            img: 'imagenes/D_NQ_NP_852248-MLC112983280267_062026-O-pack-extension-electrica-10-metros-macrotel-me1210-2500w.webp',
            descripcion: 'Extensión de largo alcance para conectar herramientas y equipos de trabajo.'
        }
    ];

    const contenedor = document.getElementById('detalle-producto');

    // Construir el detalle con la información completa del producto.
    contenedor.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <div class="detail-content">
            <p class="eyebrow">${producto.categoria}</p>
            <h2>${producto.nombre}</h2>
            <p class="detail-price">$${producto.precio.toLocaleString('es-CL')}</p>
            <p>${producto.descripcion}</p>
            <p class="detail-stock">Stock disponible: <strong>${producto.stock}</strong></p>
            <a class="btn-primary" href="catalogo.html">Volver a seleccionar</a>
        </div>
    `;
});
