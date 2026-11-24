package cl.losmaestros.inventario.controller;

import cl.losmaestros.inventario.dto.CrearStockRequest;
import cl.losmaestros.inventario.dto.StockResponse;
import cl.losmaestros.inventario.security.ClaveInterna;
import cl.losmaestros.inventario.service.InventarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Usado por productos-service al crear o eliminar productos. Requiere X-Internal-Key. */
@RestController
@RequestMapping("/api/inventario/internal")
@Tag(name = "Interno", description = "Uso exclusivo entre microservicios (cabecera X-Internal-Key)")
public class InternoController {

    private final InventarioService servicio;
    private final ClaveInterna claveInterna;

    public InternoController(InventarioService servicio, ClaveInterna claveInterna) {
        this.servicio = servicio;
        this.claveInterna = claveInterna;
    }

    @PostMapping
    @Operation(summary = "Registrar stock inicial de un producto nuevo")
    public ResponseEntity<StockResponse> crear(@RequestHeader(ClaveInterna.CABECERA) String clave,
                                               @Valid @RequestBody CrearStockRequest req) {
        claveInterna.validar(clave);
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crearDesdeProductos(req));
    }

    @DeleteMapping("/{productoId}")
    @Operation(summary = "Eliminar el stock de un producto eliminado")
    public ResponseEntity<Void> eliminar(@RequestHeader(ClaveInterna.CABECERA) String clave,
                                         @PathVariable Long productoId) {
        claveInterna.validar(clave);
        servicio.eliminarDesdeProductos(productoId);
        return ResponseEntity.noContent().build();
    }
}
