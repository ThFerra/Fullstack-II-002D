package cl.losmaestros.usuarios.dto;

import cl.losmaestros.usuarios.model.Usuario;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String run,
        String nombre,
        String apellidos,
        String correo,
        String telefono,
        String tipo,
        String region,
        String comuna,
        String direccion,
        LocalDateTime creadoEn
) {

    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getRun(), u.getNombre(), u.getApellidos(), u.getCorreo(),
                u.getTelefono(), u.getTipo(), u.getRegion(), u.getComuna(), u.getDireccion(), u.getCreadoEn());
    }
}
