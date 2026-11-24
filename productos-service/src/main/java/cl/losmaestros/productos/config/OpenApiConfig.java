package cl.losmaestros.productos.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación Swagger: http://localhost:8083/swagger-ui.html
 * El botón "Authorize" pide el token que entrega POST /api/auth/login (puerto 8081).
 */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "Ferretería Los Maestros - Productos / Catálogo",
        version = "1.0",
        description = "Catálogo de productos y categorías de la ferretería."))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}
