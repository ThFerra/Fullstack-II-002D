package cl.losmaestros.auth.service;

import cl.losmaestros.auth.exception.ReglaNegocioException;

/** Misma regla que el registro del frontend: 8 a 64 caracteres, con letras y números. */
public final class ReglasPassword {

    private ReglasPassword() {
    }

    public static void validar(String password) {
        if (password == null || password.length() < 8 || password.length() > 64
                || !password.matches(".*[A-Za-z].*") || !password.matches(".*\\d.*")) {
            throw new ReglaNegocioException("La contraseña debe tener entre 8 y 64 caracteres e incluir letras y números.");
        }
    }
}
