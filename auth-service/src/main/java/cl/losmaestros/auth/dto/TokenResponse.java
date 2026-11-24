package cl.losmaestros.auth.dto;

/** Lo que recibe el frontend al iniciar sesión o renovar la sesión. */
public record TokenResponse(
        String accessToken,
        String refreshToken,
        String tipo,
        long expiraEnSegundos,
        String correo,
        String rol
) {
}
