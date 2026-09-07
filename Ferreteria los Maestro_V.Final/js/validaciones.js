// Validación Login
function validarEmail(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// Credenciales cliente.
const usuarioPrueba = {
    correo: 'cliente@losmaestros.cl',
    password: 'Cliente123'
};

function registrarActividad(descripcion) {
    const actividad = JSON.parse(localStorage.getItem('actividad_maestros')) || [];
    actividad.unshift({ descripcion, fecha: new Date().toLocaleString('es-CL') });
    localStorage.setItem('actividad_maestros', JSON.stringify(actividad.slice(0, 30)));
}

// Comprobar RUN.
function validarRun(run) {
    const runLimpio = run.replace(/[^0-9kK]/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(runLimpio)) return false;

    const cuerpo = runLimpio.slice(0, -1);
    const verificador = runLimpio.slice(-1);
    let suma = 0;
    let multiplicador = 2;

    for (let indice = cuerpo.length - 1; indice >= 0; indice -= 1) {
        suma += Number(cuerpo[indice]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return verificador === esperado;
}

const formLogin = document.getElementById('form-login');
if (formLogin) {
    // Validar perfil.
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        let valido = true;

        const correo = document.getElementById('login-correo').value.trim();
        const pass = document.getElementById('login-password').value.trim();

        const errCorreo = document.getElementById('err-login-correo');
        const errPass = document.getElementById('err-login-password');
        const mensajeLogin = document.getElementById('exito-login');

        // Reglas requeridas
        if (!correo || !validarEmail(correo) || correo.length > 100) {
            errCorreo.textContent = "Ingrese un correo válido (máx. 100 caracteres).";
            valido = false;
        } else {
            errCorreo.textContent = "";
        }

        // Reglas requeridas
        if (!pass || pass.length < 4 || pass.length > 10) {
            errPass.textContent = "La contraseña es obligatoria (entre 4 y 10 caracteres).";
            valido = false;
        } else {
            errPass.textContent = "";
        }

        if (valido && (correo.toLowerCase() !== usuarioPrueba.correo || pass !== usuarioPrueba.password)) {
            mensajeLogin.textContent = "El correo o la contraseña no coinciden con un usuario registrado.";
            mensajeLogin.classList.add('login-error');
            valido = false;
        } else {
            mensajeLogin.textContent = "";
            mensajeLogin.classList.remove('login-error');
        }

        if (valido) {
            sessionStorage.setItem('los_maestros_user_session', 'active');
            registrarActividad('Inicio de sesión como cliente');
            mensajeLogin.textContent = "¡Inicio de sesión exitoso! Redireccionando...";
            setTimeout(() => {
                window.location.href = "perfil.html";
            }, 1500);
        }
    });
}

const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    // Envío de consultas.
    formContacto.addEventListener('submit', (event) => {
        event.preventDefault();
        let valido = true;
        const nombre = document.getElementById('nombre-contacto').value.trim();
        const correo = document.getElementById('correo-contacto').value.trim();
        const mensaje = document.getElementById('mensaje-contacto').value.trim();
        const errorNombre = document.getElementById('err-nombre-contacto');
        const errorCorreo = document.getElementById('err-correo-contacto');
        const errorMensaje = document.getElementById('err-mensaje-contacto');
        const exito = document.getElementById('exito-contacto');

        errorNombre.textContent = '';
        errorCorreo.textContent = '';
        errorMensaje.textContent = '';
        exito.textContent = '';

        if (!nombre || nombre.length > 100) {
            errorNombre.textContent = 'El nombre es obligatorio y debe tener máximo 100 caracteres.';
            valido = false;
        }
        if (!correo || correo.length > 100 || !validarEmail(correo)) {
            errorCorreo.textContent = 'Ingrese un correo válido de máximo 100 caracteres.';
            valido = false;
        }
        if (!mensaje || mensaje.length > 500) {
            errorMensaje.textContent = 'El comentario es obligatorio y debe tener máximo 500 caracteres.';
            valido = false;
        }

        if (valido) {
            registrarActividad('Envió una consulta de contacto');
            exito.textContent = 'Consulta enviada correctamente.';
            formContacto.reset();
        }
    });
}

const regionesChile = [
    { nombre: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre'] },
    { nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte'] },
    { nombre: 'Antofagasta', comunas: ['Antofagasta', 'Calama', 'Tocopilla'] },
    { nombre: 'Atacama', comunas: ['Copiapó', 'Caldera', 'Vallenar'] },
    { nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Vicuña'] },
    { nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
    { nombre: 'Metropolitana de Santiago', comunas: ['Santiago', 'Maipú', 'Puente Alto'] },
    { nombre: 'O’Higgins', comunas: ['Rancagua', 'Machalí', 'San Fernando'] },
    { nombre: 'Maule', comunas: ['Talca', 'Curicó', 'Linares'] },
    { nombre: 'Ñuble', comunas: ['Chillán', 'Bulnes', 'San Carlos'] },
    { nombre: 'Biobío', comunas: ['Concepción', 'Los Ángeles', 'Talcahuano'] },
    { nombre: 'La Araucanía', comunas: ['Temuco', 'Angol', 'Villarrica'] },
    { nombre: 'Los Ríos', comunas: ['Valdivia', 'La Unión', 'Río Bueno'] },
    { nombre: 'Los Lagos', comunas: ['Puerto Montt', 'Osorno', 'Castro'] },
    { nombre: 'Aysén', comunas: ['Coyhaique', 'Aysén', 'Chile Chico'] },
    { nombre: 'Magallanes', comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir'] }
];

const formRegistro = document.getElementById('form-registro');
const selectorRegion = document.getElementById('region');
const selectorComuna = document.getElementById('comuna');

if (selectorRegion && selectorComuna) {
    // Regiones disponibles
    regionesChile.forEach((region) => {
        const opcion = document.createElement('option');
        opcion.value = region.nombre;
        opcion.textContent = region.nombre;
        selectorRegion.appendChild(opcion);
    });

    selectorRegion.addEventListener('change', () => {
        const regionSeleccionada = regionesChile.find((region) => region.nombre === selectorRegion.value);
        selectorComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
        selectorComuna.disabled = !regionSeleccionada;

        if (regionSeleccionada) {
            regionSeleccionada.comunas.forEach((comuna) => {
                const opcion = document.createElement('option');
                opcion.value = comuna;
                opcion.textContent = comuna;
                selectorComuna.appendChild(opcion);
            });
        }
    });
}

if (formRegistro) {
    // Nuevo Usuario
    formRegistro.addEventListener('submit', (event) => {
        event.preventDefault();
        let valido = true;
        const campos = {
            run: document.getElementById('run').value.trim().toUpperCase(),
            nombre: document.getElementById('nombre').value.trim(),
            apellidos: document.getElementById('apellidos').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            tipo: document.getElementById('tipo-usuario').value,
            region: document.getElementById('region').value,
            comuna: document.getElementById('comuna').value,
            direccion: document.getElementById('direccion').value.trim()
        };

        const errores = {
            run: document.getElementById('err-run'),
            nombre: document.getElementById('err-nombre'),
            apellidos: document.getElementById('err-apellidos'),
            correo: document.getElementById('err-correo'),
            tipo: document.getElementById('err-tipo-usuario'),
            region: document.getElementById('err-region'),
            comuna: document.getElementById('err-comuna'),
            direccion: document.getElementById('err-direccion')
        };
        Object.values(errores).forEach((error) => { error.textContent = ''; });

        const reglas = [
            ['run', !validarRun(campos.run), 'Ingrese un RUN válido, sin puntos ni guion.'],
            ['nombre', !campos.nombre || campos.nombre.length > 50, 'El nombre es obligatorio y debe tener máximo 50 caracteres.'],
            ['apellidos', !campos.apellidos || campos.apellidos.length > 100, 'Los apellidos son obligatorios y deben tener máximo 100 caracteres.'],
            ['correo', !campos.correo || campos.correo.length > 100 || !validarEmail(campos.correo), 'Ingrese un correo válido de máximo 100 caracteres.'],
            ['tipo', !campos.tipo, 'Seleccione un tipo de usuario.'],
            ['region', !campos.region, 'Seleccione una región.'],
            ['comuna', !campos.comuna, 'Seleccione una comuna.'],
            ['direccion', !campos.direccion || campos.direccion.length > 300, 'La dirección es obligatoria y debe tener máximo 300 caracteres.']
        ];

        reglas.forEach(([campo, tieneError, mensaje]) => {
            if (tieneError) {
                errores[campo].textContent = mensaje;
                valido = false;
            }
        });

        if (valido) {
            document.getElementById('exito-registro').textContent = 'Usuario registrado correctamente.';
            formRegistro.reset();
            selectorComuna.innerHTML = '<option value="">-- Seleccione primero una Región --</option>';
            selectorComuna.disabled = true;
        }
    });
}

// Validacion administrativo
document.addEventListener('DOMContentLoaded', () => {
    // Acceso del administrador.
    const loginView = document.getElementById('admin-login-view');
    const panelView = document.getElementById('admin-panel-view');
    const formAdmin = document.getElementById('form-admin-login');
    const logoutButton = document.getElementById('btn-admin-logout');

    if (!loginView || !panelView || !formAdmin) return;

    const adminSessionKey = 'los_maestros_admin_session';
    const adminEmail = 'admin@losmaestros.cl';
    const adminPassword = 'Admin123';

    function showAdminPanel() {
        loginView.hidden = true;
        panelView.hidden = false;
    }

    if (sessionStorage.getItem(adminSessionKey) === 'active') {
        showAdminPanel();
    }

    formAdmin.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('admin-correo').value.trim().toLowerCase();
        const password = document.getElementById('admin-password').value;
        const emailError = document.getElementById('err-admin-correo');
        const passwordError = document.getElementById('err-admin-password');
        const message = document.getElementById('admin-login-message');
        let valid = true;

        emailError.textContent = '';
        passwordError.textContent = '';
        message.textContent = '';

        if (email !== adminEmail) {
            emailError.textContent = 'El correo no corresponde a un administrador.';
            valid = false;
        }

        if (password !== adminPassword) {
            passwordError.textContent = 'La contraseña de administrador no es correcta.';
            valid = false;
        }

        if (!valid) return;

        sessionStorage.setItem(adminSessionKey, 'active');
        message.textContent = 'Acceso autorizado. Cargando panel...';
        setTimeout(showAdminPanel, 500);
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem(adminSessionKey);
            panelView.hidden = true;
            loginView.hidden = false;
            formAdmin.reset();
        });
    }

    const formProducto = document.getElementById('form-producto-admin');
    const listaProductos = document.getElementById('lista-productos-admin');
    const formUsuario = document.getElementById('form-usuario-admin');
    const listaUsuarios = document.getElementById('lista-usuarios-admin');
    let productoEnEdicion = null;
    let usuarioEnEdicion = null;

    function obtenerProductosAdmin() {
        return JSON.parse(localStorage.getItem('productos_maestros')) || [];
    }

    function renderProductosAdmin() {
        if (!listaProductos) return;
        const productos = obtenerProductosAdmin();
        listaProductos.innerHTML = productos.map((producto) => `
            <article class="admin-product-row">
                <div>
                    <strong>${producto.nombre}</strong>
                    <span>${producto.categoria} · $${Number(producto.precio).toLocaleString('es-CL')} · Stock: ${producto.stock}</span>
                </div>
                <button class="btn-secondary btn-editar-producto" type="button" data-id="${producto.id}">Editar</button>
            </article>
        `).join('');

        listaProductos.querySelectorAll('.btn-editar-producto').forEach((button) => {
            button.addEventListener('click', () => {
                const producto = productos.find((item) => item.id === Number(button.dataset.id));
                if (!producto) return;
                productoEnEdicion = producto.id;
                document.getElementById('admin-producto-nombre').value = producto.nombre;
                document.getElementById('admin-producto-precio').value = producto.precio;
                document.getElementById('admin-producto-stock').value = producto.stock;
                document.getElementById('admin-producto-categoria').value = producto.categoria;
                document.getElementById('btn-guardar-producto').textContent = 'Actualizar Producto';
                document.getElementById('btn-cancelar-producto').hidden = false;
            });
        });
    }

    if (formProducto) {
        formProducto.addEventListener('submit', (event) => {
            event.preventDefault();
            const productos = obtenerProductosAdmin();
            const producto = {
                id: productoEnEdicion || Date.now(),
                nombre: document.getElementById('admin-producto-nombre').value.trim(),
                precio: Number(document.getElementById('admin-producto-precio').value),
                stock: Number(document.getElementById('admin-producto-stock').value),
                categoria: document.getElementById('admin-producto-categoria').value,
                img: 'https://via.placeholder.com/200?text=Producto'
            };

            if (!producto.nombre || !producto.precio || producto.stock < 0 || !producto.categoria) return;

            const indice = productos.findIndex((item) => item.id === productoEnEdicion);
            if (indice >= 0) {
                producto.img = productos[indice].img;
                productos[indice] = producto;
            } else {
                productos.push(producto);
            }

            localStorage.setItem('productos_maestros', JSON.stringify(productos));
            document.getElementById('mensaje-producto-admin').textContent = productoEnEdicion ? 'Producto actualizado.' : 'Producto creado.';
            formProducto.reset();
            productoEnEdicion = null;
            document.getElementById('btn-guardar-producto').textContent = 'Guardar Producto';
            document.getElementById('btn-cancelar-producto').hidden = true;
            renderProductosAdmin();
        });
    }

    const cancelarProducto = document.getElementById('btn-cancelar-producto');
    if (cancelarProducto) {
        cancelarProducto.addEventListener('click', () => {
            productoEnEdicion = null;
            formProducto.reset();
            document.getElementById('btn-guardar-producto').textContent = 'Guardar Producto';
            cancelarProducto.hidden = true;
        });
    }

    function obtenerUsuariosAdmin() {
        const guardados = JSON.parse(localStorage.getItem('usuarios_maestros'));
        if (guardados) return guardados;
        const iniciales = [
            { id: 1, run: '12345678K', nombre: 'Juan Pérez', correo: 'juan.perez@email.com', rol: 'Contratista' },
            { id: 2, run: '18765432-1', nombre: 'María González', correo: 'maria.g@email.com', rol: 'Vendedor' }
        ];
        localStorage.setItem('usuarios_maestros', JSON.stringify(iniciales));
        return iniciales;
    }

    function renderUsuariosAdmin() {
        if (!listaUsuarios) return;
        const usuarios = obtenerUsuariosAdmin();
        listaUsuarios.innerHTML = usuarios.map((usuario) => `
            <tr>
                <td>${usuario.run}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td><span class="profile-badge">${usuario.rol}</span></td>
                <td><button class="btn-secondary btn-editar-usuario" type="button" data-id="${usuario.id}">Editar</button></td>
            </tr>
        `).join('');

        listaUsuarios.querySelectorAll('.btn-editar-usuario').forEach((button) => {
            button.addEventListener('click', () => {
                const usuario = usuarios.find((item) => item.id === Number(button.dataset.id));
                if (!usuario) return;
                usuarioEnEdicion = usuario.id;
                document.getElementById('admin-usuario-run').value = usuario.run;
                document.getElementById('admin-usuario-nombre').value = usuario.nombre;
                document.getElementById('admin-usuario-correo').value = usuario.correo;
                document.getElementById('admin-usuario-rol').value = usuario.rol;
                formUsuario.querySelector('button[type="submit"]').textContent = 'Actualizar usuario';
            });
        });
    }

    if (formUsuario) {
        formUsuario.addEventListener('submit', (event) => {
            event.preventDefault();
            const usuarios = obtenerUsuariosAdmin();
            const usuario = {
                id: usuarioEnEdicion || Date.now(),
                run: document.getElementById('admin-usuario-run').value.trim().toUpperCase(),
                nombre: document.getElementById('admin-usuario-nombre').value.trim(),
                correo: document.getElementById('admin-usuario-correo').value.trim(),
                rol: document.getElementById('admin-usuario-rol').value
            };
            if (!usuario.run || !usuario.nombre || !validarEmail(usuario.correo) || !usuario.rol) return;

            const indice = usuarios.findIndex((item) => item.id === usuarioEnEdicion);
            if (indice >= 0) usuarios[indice] = usuario;
            else usuarios.push(usuario);
            localStorage.setItem('usuarios_maestros', JSON.stringify(usuarios));
            document.getElementById('mensaje-usuario-admin').textContent = usuarioEnEdicion ? 'Usuario actualizado.' : 'Usuario creado.';
            formUsuario.reset();
            usuarioEnEdicion = null;
            formUsuario.querySelector('button[type="submit"]').textContent = 'Crear usuario';
            renderUsuariosAdmin();
        });
    }

    renderProductosAdmin();
    renderUsuariosAdmin();
});