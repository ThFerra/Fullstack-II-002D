// Validación Formulario Login
function validarEmail(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// Credenciales de demostración del usuario cliente.
const usuarioPrueba = {
    correo: 'cliente@losmaestros.cl',
    password: 'Cliente123'
};

function registrarActividad(descripcion) {
    const actividad = JSON.parse(localStorage.getItem('actividad_maestros')) || [];
    actividad.unshift({ descripcion, fecha: new Date().toLocaleString('es-CL') });
    localStorage.setItem('actividad_maestros', JSON.stringify(actividad.slice(0, 30)));
}

const formLogin = document.getElementById('form-login');
if (formLogin) {
    // Validar credenciales y abrir el perfil del cliente.
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        let valido = true;

        const correo = document.getElementById('login-correo').value.trim();
        const pass = document.getElementById('login-password').value.trim();

        const errCorreo = document.getElementById('err-login-correo');
        const errPass = document.getElementById('err-login-password');
        const mensajeLogin = document.getElementById('exito-login');

        // Reglas requeridas: Correo obligatorio, max 100 caracteres y formato válido
        if (!correo || !validarEmail(correo) || correo.length > 100) {
            errCorreo.textContent = "Ingrese un correo válido (máx. 100 caracteres).";
            valido = false;
        } else {
            errCorreo.textContent = "";
        }

        // Reglas requeridas: Contraseña obligatoria y entre 4 y 10 caracteres
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
    // Validar y confirmar el envío de consultas.
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
