package cl.losmaestros.usuarios.service;

import cl.losmaestros.usuarios.client.AuthClient;
import cl.losmaestros.usuarios.dto.*;
import cl.losmaestros.usuarios.exception.RecursoNoEncontradoException;
import cl.losmaestros.usuarios.exception.ReglaNegocioException;
import cl.losmaestros.usuarios.model.Usuario;
import cl.losmaestros.usuarios.repository.UsuarioRepository;
import cl.losmaestros.usuarios.util.Regiones;
import cl.losmaestros.usuarios.util.ValidadorRun;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/** Lógica de negocio de usuarios: mismas validaciones que tenía el frontend, ahora en el servidor. */
@Service
public class UsuarioService {

    private static final Set<String> TIPOS = Set.of("Contratista", "Vendedor", "Cliente", "Administrador");

    private final UsuarioRepository repositorio;
    private final AuthClient authClient;

    public UsuarioService(UsuarioRepository repositorio, AuthClient authClient) {
        this.repositorio = repositorio;
        this.authClient = authClient;
    }

    // ---------- Registro público ----------

    /**
     * Guarda el perfil y luego pide a auth-service crear la credencial.
     * Si auth-service falla, la excepción revierte la transacción y el perfil no queda guardado.
     */
    @Transactional
    public UsuarioResponse registrar(RegistroRequest req) {
        String run = validarRun(req.run());
        String correo = req.correo().trim().toLowerCase();

        validarCorreoDisponible(correo, null);
        validarRunDisponible(run);
        validarTipo(req.tipo());
        validarUbicacion(req.region(), req.comuna());
        validarTelefono(req.telefono(), "Ingresa un teléfono válido para contactarte.");
        validarPassword(req.password());
        if (!req.password().equals(req.confirmarPassword())) {
            throw new ReglaNegocioException("Las contraseñas no coinciden.");
        }

        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setNombre(req.nombre().trim());
        usuario.setApellidos(req.apellidos().trim());
        usuario.setCorreo(correo);
        usuario.setTelefono(req.telefono().trim());
        usuario.setTipo(req.tipo());
        usuario.setRegion(req.region());
        usuario.setComuna(req.comuna());
        usuario.setDireccion(req.direccion().trim());
        repositorio.saveAndFlush(usuario);

        authClient.crearCredencial(correo, req.password(), "CLIENTE");
        return UsuarioResponse.de(usuario);
    }

    // ---------- Perfil del usuario con sesión ----------

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorCorreo(String correo) {
        return UsuarioResponse.de(buscarPorCorreo(correo));
    }

    /** Si cambia el correo, también se cambia en auth-service y el usuario debe volver a iniciar sesión. */
    @Transactional
    public UsuarioResponse actualizarPerfil(String correoSesion, PerfilRequest req) {
        Usuario usuario = buscarPorCorreo(correoSesion);
        String correoNuevo = req.correo().trim().toLowerCase();

        validarCorreoDisponible(correoNuevo, usuario.getId());
        validarTelefono(req.telefono(), "Ingresa un teléfono válido.");
        validarUbicacion(req.region(), req.comuna());

        String correoAnterior = usuario.getCorreo();
        usuario.setNombre(req.nombre().trim());
        usuario.setApellidos(req.apellidos().trim());
        usuario.setCorreo(correoNuevo);
        usuario.setTelefono(req.telefono().trim());
        usuario.setRegion(req.region());
        usuario.setComuna(req.comuna());
        usuario.setDireccion(req.direccion().trim());
        repositorio.saveAndFlush(usuario);

        if (!correoAnterior.equalsIgnoreCase(correoNuevo)) {
            authClient.cambiarCorreo(correoAnterior, correoNuevo);
        }
        return UsuarioResponse.de(usuario);
    }

    // ---------- Administración (solo ADMIN) ----------

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repositorio.findAll().stream().map(UsuarioResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.de(buscarPorId(id));
    }

    @Transactional
    public UsuarioResponse crear(UsuarioAdminRequest req) {
        String run = validarRun(req.run());
        String correo = req.correo().trim().toLowerCase();
        validarCorreoDisponible(correo, null);
        validarRunDisponible(run);
        validarTipo(req.tipo());
        validarUbicacionOpcional(req.region(), req.comuna());
        if (req.rol() == null) {
            throw new ReglaNegocioException("El rol es obligatorio (ADMIN o CLIENTE).");
        }
        validarPassword(req.password());

        Usuario usuario = new Usuario();
        usuario.setRun(run);
        aplicarDatosAdmin(usuario, req, correo);
        repositorio.saveAndFlush(usuario);

        authClient.crearCredencial(correo, req.password(), req.rol());
        return UsuarioResponse.de(usuario);
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioAdminRequest req) {
        Usuario usuario = buscarPorId(id);
        String run = validarRun(req.run());
        String correo = req.correo().trim().toLowerCase();

        if (!run.equals(usuario.getRun())) {
            validarRunDisponible(run);
        }
        validarCorreoDisponible(correo, usuario.getId());
        validarTipo(req.tipo());
        validarUbicacionOpcional(req.region(), req.comuna());

        String correoAnterior = usuario.getCorreo();
        usuario.setRun(run);
        aplicarDatosAdmin(usuario, req, correo);
        repositorio.saveAndFlush(usuario);

        if (!correoAnterior.equalsIgnoreCase(correo)) {
            authClient.cambiarCorreo(correoAnterior, correo);
        }
        return UsuarioResponse.de(usuario);
    }

    @Transactional
    public void eliminar(Long id, String correoAdmin) {
        Usuario usuario = buscarPorId(id);
        if (usuario.getCorreo().equalsIgnoreCase(correoAdmin)) {
            throw new ReglaNegocioException("No puedes eliminar tu propio usuario.");
        }
        repositorio.delete(usuario);
        repositorio.flush();
        authClient.eliminarCredencial(usuario.getCorreo());
    }

    // ---------- Validaciones ----------

    private String validarRun(String run) {
        if (!ValidadorRun.esValido(run)) {
            throw new ReglaNegocioException("Ingrese un RUN válido, sin puntos ni guion.");
        }
        return ValidadorRun.limpiar(run);
    }

    private void validarRunDisponible(String run) {
        if (repositorio.existsByRun(run)) {
            throw new ReglaNegocioException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese RUN.");
        }
    }

    private void validarCorreoDisponible(String correo, Long idActual) {
        repositorio.findByCorreoIgnoreCase(correo).ifPresent(existente -> {
            if (idActual == null || !existente.getId().equals(idActual)) {
                throw new ReglaNegocioException(HttpStatus.CONFLICT,
                        "Ya existe una cuenta con ese correo. Inicia sesión o utiliza otro correo.");
            }
        });
    }

    private void validarTipo(String tipo) {
        if (!TIPOS.contains(tipo)) {
            throw new ReglaNegocioException("Seleccione un tipo de usuario válido: " + String.join(", ", TIPOS) + ".");
        }
    }

    private void validarUbicacion(String region, String comuna) {
        if (!Regiones.COMUNAS_POR_REGION.containsKey(region)) {
            throw new ReglaNegocioException("Seleccione una región.");
        }
        if (!Regiones.comunaPertenece(region, comuna)) {
            throw new ReglaNegocioException("Seleccione una comuna de la región elegida.");
        }
    }

    private void validarUbicacionOpcional(String region, String comuna) {
        boolean hayRegion = region != null && !region.isBlank();
        boolean hayComuna = comuna != null && !comuna.isBlank();
        if (hayRegion || hayComuna) {
            validarUbicacion(region, comuna);
        }
    }

    private void validarTelefono(String telefono, String mensaje) {
        if (telefono == null || telefono.replaceAll("\\D", "").length() < 8) {
            throw new ReglaNegocioException(mensaje);
        }
    }

    private void validarPassword(String password) {
        if (password == null || password.length() < 8 || password.length() > 64
                || !password.matches(".*[A-Za-z].*") || !password.matches(".*\\d.*")) {
            throw new ReglaNegocioException("La contraseña debe tener entre 8 y 64 caracteres e incluir letras y números.");
        }
    }

    private void aplicarDatosAdmin(Usuario usuario, UsuarioAdminRequest req, String correo) {
        usuario.setNombre(req.nombre().trim());
        usuario.setApellidos(req.apellidos() == null ? null : req.apellidos().trim());
        usuario.setCorreo(correo);
        usuario.setTelefono(req.telefono());
        usuario.setTipo(req.tipo());
        usuario.setRegion(req.region());
        usuario.setComuna(req.comuna());
        usuario.setDireccion(req.direccion());
    }

    private Usuario buscarPorId(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario con id " + id + "."));
    }

    private Usuario buscarPorCorreo(String correo) {
        return repositorio.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe un perfil para el correo " + correo + "."));
    }
}
