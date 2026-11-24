package cl.losmaestros.usuarios.dto;

import java.util.List;

public record RegionResponse(String nombre, List<String> comunas) {
}
