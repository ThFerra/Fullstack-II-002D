document.addEventListener('DOMContentLoaded', () => {
    // Datos mostrados en la vista ampliada del producto seleccionado.
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
