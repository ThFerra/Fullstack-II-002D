package cl.losmaestros.auth.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación Swagger: http://localhost:8081/swagger-ui.html
 * El botón "Authorize" pide el token que entrega POST /api/auth/login (puerto 8081).
 */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "Ferretería Los Maestros - Autenticación",
        version = "1.0",
        description = "Inicio de sesión, emisión y renovación de tokens JWT y gestión de credenciales y roles."))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}
