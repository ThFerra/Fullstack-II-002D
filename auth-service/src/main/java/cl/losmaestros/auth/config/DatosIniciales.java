package cl.losmaestros.auth.config;

import cl.losmaestros.auth.model.Credencial;
import cl.losmaestros.auth.model.Rol;
import cl.losmaestros.auth.repository.CredencialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Crea las cuentas de ejemplo la primera vez que se inicia el servicio (las mismas del frontend). */
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);

    private final CredencialRepository repositorio;
    private final PasswordEncoder encoder;

    public DatosIniciales(CredencialRepository repositorio, PasswordEncoder encoder) {
        this.repositorio = repositorio;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("admin@losmaestros.cl", "Admin123", Rol.ADMIN);
        crearSiNoExiste("cliente@losmaestros.cl", "Cliente123", Rol.CLIENTE);
    }

    private void crearSiNoExiste(String correo, String password, Rol rol) {
        if (!repositorio.existsByCorreoIgnoreCase(correo)) {
            repositorio.save(new Credencial(correo, encoder.encode(password), rol));
            log.info("Cuenta inicial creada: {} ({})", correo, rol);
        }
    }
}
