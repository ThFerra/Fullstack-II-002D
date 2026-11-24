package cl.losmaestros.contenido.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación Swagger: http://localhost:8087/swagger-ui.html
 * El botón "Authorize" pide el token que entrega POST /api/auth/login (puerto 8081).
 */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "Ferretería Los Maestros - Contenido / Novedades",
        version = "1.0",
        description = "Noticias y novedades que se muestran en la tienda."))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}
