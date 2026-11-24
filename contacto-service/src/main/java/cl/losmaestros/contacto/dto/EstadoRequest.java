package cl.losmaestros.contacto.dto;

import cl.losmaestros.contacto.model.EstadoConsulta;
import jakarta.validation.constraints.NotNull;

public record EstadoRequest(@NotNull(message = "El estado es obligatorio.") EstadoConsulta estado) {
}
