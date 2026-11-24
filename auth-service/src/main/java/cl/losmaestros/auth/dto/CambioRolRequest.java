package cl.losmaestros.auth.dto;

import cl.losmaestros.auth.model.Rol;
import jakarta.validation.constraints.NotNull;

public record CambioRolRequest(@NotNull(message = "El rol es obligatorio.") Rol rol) {
}
