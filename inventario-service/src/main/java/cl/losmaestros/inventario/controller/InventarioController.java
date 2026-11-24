package cl.losmaestros.inventario.controller;

import cl.losmaestros.inventario.dto.*;
import cl.losmaestros.inventario.security.UsuarioAutenticado;
import cl.losmaestros.inventario.service.InventarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@Tag(name = "Inventario", description = "Stock de productos y movimientos")
public class InventarioController {

    private final InventarioService servicio;

    public InventarioController(InventarioService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar el stock de todos los productos (público)")
    @ApiResponse(responseCode = "200", description = "Listado")
    public List<StockResponse> listar() {
        return servicio.listar();
    }

    @GetMapping("/criticos")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Productos con stock crítico (ADMIN)", description = "Stock menor o igual al stock mínimo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado"),
            @ApiResponse(responseCode = "401", description = "Sin sesión"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN")
    })
    public List<StockResponse> criticos() {
        return servicio.criticos();
    }

    @GetMapping("/{productoId}")
    @Operation(summary = "Stock de un producto (público)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrado"),
            @ApiResponse(responseCode = "404", description = "Sin stock registrado")
    })
    public StockResponse obtener(@PathVariable Long productoId) {
        return servicio.obtener(productoId);
    }

    @GetMapping("/{productoId}/disponibilidad")
    @Operation(summary = "¿Hay stock suficiente? (público)", description = "Lo usa carrito-service antes de agregar unidades.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Respuesta con disponible true/false"),
            @ApiResponse(responseCode = "400", description = "Cantidad inválida"),
            @ApiResponse(responseCode = "404", description = "Sin stock registrado")
    })
    public DisponibilidadResponse disponibilidad(@PathVariable Long productoId,
                                                 @RequestParam(defaultValue = "1") int cantidad) {
        return servicio.disponibilidad(productoId, cantidad);
    }

    @PutMapping("/{productoId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Fijar el stock de un producto (ADMIN)", description = "Crea el registro si no existía.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock actualizado"),
            @ApiResponse(responseCode = "400", description = "Cantidad inválida"),
            @ApiResponse(responseCode = "401", description = "Sin sesión"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN")
    })
    public StockResponse ajustar(@PathVariable Long productoId, @Valid @RequestBody AjusteStockRequest req,
                                 @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.ajustar(productoId, req, usuario.correo());
    }

    @PostMapping("/{productoId}/entradas")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Registrar entrada de mercadería (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock aumentado"),
            @ApiResponse(responseCode = "400", description = "Cantidad inválida"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "Sin stock registrado")
    })
    public StockResponse entrada(@PathVariable Long productoId, @Valid @RequestBody MovimientoRequest req,
                                 @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.entrada(productoId, req, usuario.correo());
    }

    @PostMapping("/{productoId}/salidas")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Registrar salida / venta (ADMIN)", description = "Rechaza la salida si no hay stock suficiente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock descontado"),
            @ApiResponse(responseCode = "400", description = "Cantidad inválida"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "Sin stock registrado"),
            @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    })
    public StockResponse salida(@PathVariable Long productoId, @Valid @RequestBody MovimientoRequest req,
                                @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.salida(productoId, req, usuario.correo());
    }

    @GetMapping("/{productoId}/movimientos")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Historial de movimientos de un producto (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Historial"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "Sin stock registrado")
    })
    public List<MovimientoResponse> movimientos(@PathVariable Long productoId) {
        return servicio.movimientos(productoId);
    }

    @DeleteMapping("/{productoId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar el stock de un producto (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminado"),
            @ApiResponse(responseCode = "403", description = "No es ADMIN"),
            @ApiResponse(responseCode = "404", description = "Sin stock registrado")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long productoId) {
        servicio.eliminar(productoId);
        return ResponseEntity.noContent().build();
    }
}
