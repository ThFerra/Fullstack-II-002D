package cl.losmaestros.usuarios.controller;

import cl.losmaestros.usuarios.dto.RegionResponse;
import cl.losmaestros.usuarios.util.Regiones;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/regiones")
@Tag(name = "Regiones", description = "Regiones y comunas para los formularios")
public class RegionController {

    @GetMapping
    @Operation(summary = "Listar regiones con sus comunas (público)")
    @ApiResponse(responseCode = "200", description = "Listado")
    public List<RegionResponse> listar() {
        return Regiones.COMUNAS_POR_REGION.entrySet().stream()
                .map(e -> new RegionResponse(e.getKey(), e.getValue()))
                .toList();
    }
}
