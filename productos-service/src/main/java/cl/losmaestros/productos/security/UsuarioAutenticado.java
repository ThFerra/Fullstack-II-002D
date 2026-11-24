package cl.losmaestros.productos.security;

/** Datos del usuario que vienen dentro del token JWT. */
public record UsuarioAutenticado(String correo, String rol) {

    public boolean esAdmin() {
        return "ADMIN".equals(rol);
    }
}
