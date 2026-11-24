package cl.losmaestros.usuarios.util;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Regiones y comunas disponibles (las mismas del formulario de registro del frontend). */
public final class Regiones {

    public static final Map<String, List<String>> COMUNAS_POR_REGION = new LinkedHashMap<>();

    static {
        COMUNAS_POR_REGION.put("Arica y Parinacota", List.of("Arica", "Camarones", "Putre"));
        COMUNAS_POR_REGION.put("Tarapacá", List.of("Iquique", "Alto Hospicio", "Pozo Almonte"));
        COMUNAS_POR_REGION.put("Coquimbo", List.of("La Serena", "Coquimbo", "Ovalle", "Vicuña"));
        COMUNAS_POR_REGION.put("Metropolitana de Santiago", List.of("Santiago", "Maipú", "Puente Alto"));
    }

    private Regiones() {
    }

    public static boolean comunaPertenece(String region, String comuna) {
        List<String> comunas = COMUNAS_POR_REGION.get(region);
        return comunas != null && comunas.contains(comuna);
    }
}
