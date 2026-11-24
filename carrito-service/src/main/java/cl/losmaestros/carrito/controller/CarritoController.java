package cl.losmaestros.carrito.controller;

import cl.losmaestros.carrito.dto.AgregarItemRequest;
import cl.losmaestros.carrito.dto.CambiarCantidadRequest;
import cl.losmaestros.carrito.dto.CarritoResponse;
import cl.losmaestros.carrito.security.UsuarioAutenticado;
import cl.losmaestros.carrito.service.CarritoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Carrito del usuario con sesión (CLIENTE o ADMIN). Cada usuario solo ve y modifica su propio carrito. */
@RestController
@RequestMapping("/api/carrito")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Carrito", description = "Carrito de compras del usuario con sesión")
@ApiResponse(responseCode = "401", description = "Sin sesión")
public class CarritoController {

    private final CarritoService servicio;

    public CarritoController(CarritoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Ver mi carrito", description = "Incluye subtotales, total de unidades y total en pesos.")
    @ApiResponse(responseCode = "200", description = "Carrito (vacío si aún no agrega productos)")
    public CarritoResponse ver(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.obtener(usuario.correo());
    }

    @PostMapping("/items")
    @Operation(summary = "Agregar un producto",
            description = "Si el producto ya está en el carrito suma la cantidad. Rechaza si supera el stock.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Carrito actualizado"),
            @ApiResponse(responseCode = "400", description = "Cantidad inválida"),
            @ApiResponse(responseCode = "404", description = "El producto no existe"),
            @ApiResponse(responseCode = "409", description = "Stock insuficiente"),
            @ApiResponse(responseCode = "503", description = "Productos o Inventario no disponibles")
    })
    public CarritoResponse agregar(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                   @Valid @RequestBody AgregarItemRequest req) {
        return servicio.agregar(usuario.correo(), req);
    }

    @PutMapping("/items/{productoId}")
    @Operation(summary = "Cambiar la cantidad de un producto")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Carrito actualizado"),
            @ApiResponse(responseCode = "400", description = "Cantidad inválida"),
            @ApiResponse(responseCode = "404", description = "El producto no está en el carrito"),
            @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    })
    public CarritoResponse cambiarCantidad(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                           @PathVariable Long productoId,
                                           @Valid @RequestBody CambiarCantidadRequest req) {
        return servicio.cambiarCantidad(usuario.correo(), productoId, req);
    }

    @DeleteMapping("/items/{productoId}")
    @Operation(summary = "Quitar un producto del carrito (botón ❌)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Carrito actualizado"),
            @ApiResponse(responseCode = "404", description = "El producto no está en el carrito")
    })
    public CarritoResponse quitar(@AuthenticationPrincipal UsuarioAutenticado usuario, @PathVariable Long productoId) {
        return servicio.quitar(usuario.correo(), productoId);
    }

    @DeleteMapping
    @Operation(summary = "Vaciar el carrito")
    @ApiResponse(responseCode = "200", description = "Carrito vacío")
    public CarritoResponse vaciar(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return servicio.vaciar(usuario.correo());
    }
}
