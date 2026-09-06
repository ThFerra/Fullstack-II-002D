document.addEventListener('DOMContentLoaded', () => {

    // Catálogo inicial usado cuando todavía no hay productos guardados.
    const productosIniciales = [
        { 
            id: 1, 
            nombre: "Saco Cemento Polpaico 25kg", 
            categoria: "Construcción", 
            precio: 4890, stock: 150, 
            img: "imagenes/images (1).jpg" 
        },
        { 
            id: 2, 
            nombre: "Taladro Percutor 18V", 
            categoria: "Herramientas eléctricas", 
            precio: 79990, stock: 12, 
            img: "imagenes/Taladro-Percutor-Bosch-13mm-800w-Gsb-20-2-Re.webp" 
        },
        { 
            id: 3, 
            nombre: "Set Alicates Profesionales", 
            categoria: "Herramientas manuales", 
            precio: 15990, stock: 25, 
            img: "imagenes/8120020-set-de-alicates-ergonomicos-8-3-pcs-wellborn.jpg" 
        },
        { 
            id: 4, 
            nombre: "Llave Monomando Lavaplatos", 
            categoria: "Gasfitería", precio: 22990, 
            stock: 8, 
            img: "imagenes/D_NQ_NP_955306-MLC92240553458_092025-O.webp" 
        },
        { 
            id: 5, 
            nombre: "Martillo Galponero 16 oz", 
            categoria: "Herramientas manuales", 
            precio: 8990, stock: 30, 
        img: "imagenes/D_NQ_NP_608125-MLA99500492814_112025-O.webp" 
        },
        { 
            id: 6, 
            nombre: "Set de Destornilladores 6 piezas", 
            categoria: "Herramientas manuales", 
            precio: 7490, stock: 42, 
            img: "imagenes/w=1500,h=1500,fit=cover.jpg" 
        },
        { 
            id: 7, 
            nombre: "Pintura Látex Blanca 1 galón", 
            categoria: "Pinturas", 
            precio: 18990, stock: 18, 
            img: "imagenes/w=1500,h=1500,fit=cover.webp" 
        },
        { 
            id: 8, 
            nombre: "Caja de Tarugos y Tornillos", 
            categoria: "Fijaciones", 
            precio: 5990, stock: 65, 
            img: "imagenes/D_Q_NP_2X_698505-CBT112794574390_072026-T.webp" 
        },
        { 
            id: 9, 
            nombre: "Guantes de Seguridad Antideslizantes", 
            categoria: "Seguridad", 
            precio: 3990, stock: 80, 
            img: "imagenes/D_NQ_NP_807165-MLM105543785741_012026-O.webp" 
        },
        { 
            id: 10, 
            nombre: "Extensión Eléctrica 10 metros", 
            categoria: "Electricidad", 
            precio: 12990, stock: 20, 
            img: "imagenes/D_NQ_NP_852248-MLC112983280267_062026-O-pack-extension-electrica-10-metros-macrotel-me1210-2500w.webp" 
        }
    ];

    // Recuperar los productos creados o editados desde el panel admin.
    let productos = JSON.parse(localStorage.getItem('productos_maestros')) || productosIniciales;
    localStorage.setItem('productos_maestros', JSON.stringify(productos));

    let carrito = JSON.parse(localStorage.getItem('carrito_maestros')) || [];

    const gridProds = document.getElementById('grid-productos');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const btnVaciar = document.getElementById('btn-vaciar');

    // Guardar las acciones del cliente para mostrarlas en su perfil.
    function registrarActividad(descripcion) {
        const actividad = JSON.parse(localStorage.getItem('actividad_maestros')) || [];
        actividad.unshift({ descripcion, fecha: new Date().toLocaleString('es-CL') });
        localStorage.setItem('actividad_maestros', JSON.stringify(actividad.slice(0, 30)));
    }

    // Generar las tarjetas del catálogo a partir del arreglo de productos.
    function renderProductos() {
        if (!gridProds) return;
        gridProds.innerHTML = "";
        productos.forEach(prod => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <img src="${prod.img}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p class="precio">$${prod.precio.toLocaleString('es-CL')}</p>
                <p class="categoria">${prod.categoria}</p>
                <p>Stock disponible: <strong>${prod.stock}</strong></p>
                <a class="btn-secondary" href="detalle-producto.html?id=${prod.id}">Ver detalle</a>
                <button class="btn-primary" onclick="agregarAlCarrito(${prod.id})">Agregar a Selección</button>
            `;
            gridProds.appendChild(card);
        });
    }

    // Agregar un producto a la selección y actualizar el historial.
    window.agregarAlCarrito = function(id) {
        const prod = productos.find(p => p.id === id);
        if (prod) {
            carrito.push(prod);
            registrarActividad(`Agregó "${prod.nombre}" a su selección`);
            guardarYActualizar();
        }
    };

    // Quitar un producto de la selección actual.
    window.eliminarDelCarrito = function(index) {
        const producto = carrito[index];
        carrito.splice(index, 1);
        if (producto) registrarActividad(`Quitó "${producto.nombre}" de su selección`);
        guardarYActualizar();
    };

    // Persistir la selección y refrescar el resumen del carrito.
    function guardarYActualizar() {
        localStorage.setItem('carrito_maestros', JSON.stringify(carrito));
        renderCarrito();
    }

    function renderCarrito() {
        if (!listaCarrito) return;
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((prod, index) => {
            total += prod.precio;
            const li = document.createElement('li');
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.marginBottom = "8px";
            li.innerHTML = `
                <span>${prod.nombre} - $${prod.precio.toLocaleString('es-CL')}</span>
                <button onclick="eliminarDelCarrito(${index})" style="color:red; border:none; background:none; cursor:pointer;">❌</button>
            `;
            listaCarrito.appendChild(li);
        });

        if (totalCarrito) totalCarrito.textContent = total.toLocaleString('es-CL');
    }

    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            carrito = [];
            registrarActividad('Vació su selección de productos');
            guardarYActualizar();
        });
    }

    renderProductos();
    renderCarrito();
});