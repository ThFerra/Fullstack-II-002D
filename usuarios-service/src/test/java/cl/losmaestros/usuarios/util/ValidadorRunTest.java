package cl.losmaestros.usuarios.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ValidadorRunTest {

    @Test
    void aceptaRunValidoConYSinFormato() {
        assertTrue(ValidadorRun.esValido("123456785"));
        assertTrue(ValidadorRun.esValido("12.345.678-5"));
        assertTrue(ValidadorRun.esValido("11111112-k"));
    }

    @Test
    void rechazaDigitoVerificadorIncorrecto() {
        assertFalse(ValidadorRun.esValido("123456789"));
    }

    @Test
    void rechazaFormatoInvalido() {
        assertFalse(ValidadorRun.esValido(""));
        assertFalse(ValidadorRun.esValido("12345"));
        assertFalse(ValidadorRun.esValido("ABCDEFGH"));
        assertFalse(ValidadorRun.esValido(null));
    }

    @Test
    void limpiaPuntosYGuion() {
        assertEquals("11111112K", ValidadorRun.limpiar("11.111.112-k"));
    }
}
