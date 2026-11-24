package cl.losmaestros.usuarios.config;

import cl.losmaestros.usuarios.model.Usuario;
import cl.losmaestros.usuarios.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Perfiles de ejemplo. Los correos admin@ y cliente@ coinciden con las cuentas que crea auth-service,
 * así esos usuarios pueden iniciar sesión y ver su perfil desde el primer momento.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final UsuarioRepository repositorio;

    public DatosIniciales(UsuarioRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public void run(String... args) {
        crear("222222222", "Administrador", "Los Maestros", "admin@losmaestros.cl", "+56 9 1234 5678",
                "Administrador", "Coquimbo", "La Serena", "Av. del Mar 123");
        crear("111111111", "Cliente", "de prueba", "cliente@losmaestros.cl", "+56 9 8765 4321",
                "Cliente", "Coquimbo", "La Serena", "Calle Ejemplo 456");
        crear("123456785", "Juan", "Pérez", "juan.perez@email.com", "+56 9 5555 1111",
                "Contratista", "Coquimbo", "Coquimbo", "Los Aromos 12");
        crear("187654327", "María", "González", "maria.g@email.com", "+56 9 5555 2222",
                "Vendedor", "Metropolitana de Santiago", "Santiago", "Alameda 1000");
    }

    private void crear(String run, String nombre, String apellidos, String correo, String telefono,
                       String tipo, String region, String comuna, String direccion) {
        if (repositorio.existsByCorreoIgnoreCase(correo)) {
            return;
        }
        Usuario u = new Usuario();
        u.setRun(run);
        u.setNombre(nombre);
        u.setApellidos(apellidos);
        u.setCorreo(correo);
        u.setTelefono(telefono);
        u.setTipo(tipo);
        u.setRegion(region);
        u.setComuna(comuna);
        u.setDireccion(direccion);
        repositorio.save(u);
    }
}
