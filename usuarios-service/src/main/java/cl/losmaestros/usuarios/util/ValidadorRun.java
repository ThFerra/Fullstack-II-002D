package cl.losmaestros.usuarios.util;

/** Valida el RUN chileno con su dígito verificador (algoritmo módulo 11), igual que el frontend. */
public final class ValidadorRun {

    private ValidadorRun() {
    }

    /** Quita puntos y guion y deja la K en mayúscula: "12.345.678-5" -> "123456785". */
    public static String limpiar(String run) {
        return run == null ? "" : run.replaceAll("[^0-9kK]", "").toUpperCase();
    }

    public static boolean esValido(String run) {
        String limpio = limpiar(run);
        if (!limpio.matches("^\\d{7,8}[0-9K]$")) {
            return false;
        }
        String cuerpo = limpio.substring(0, limpio.length() - 1);
        char verificador = limpio.charAt(limpio.length() - 1);

        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : Character.forDigit(resto, 10);
        return verificador == esperado;
    }
}
