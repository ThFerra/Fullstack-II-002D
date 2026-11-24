# Ferretería Los Maestros — Backend con microservicios

Backend de la tienda **Ferretería Los Maestros** (DSY1104 · Desarrollo Fullstack II), construido con **Spring Boot 3, Spring Security + JWT, Spring Data JPA, MySQL y Swagger (springdoc-openapi)**.

Está dividido en **7 microservicios independientes**. Cada uno tiene su propio proyecto Maven, su propio puerto, **su propia base de datos** y su propia documentación Swagger.

| Microservicio | Carpeta | Puerto | Base de datos | Responsabilidad |
|---|---|---|---|---|
| Autenticación | `auth-service` | 8081 | `ferreteria_auth` | Login, tokens JWT (access y refresh), roles y credenciales |
| Usuarios | `usuarios-service` | 8082 | `ferreteria_usuarios` | Registro, perfil "Mi cuenta" y administración de usuarios |
| Productos / Catálogo | `productos-service` | 8083 | `ferreteria_productos` | Productos y categorías |
| Inventario | `inventario-service` | 8084 | `ferreteria_inventario` | Stock, entradas/salidas, productos críticos |
| Carrito | `carrito-service` | 8085 | `ferreteria_carrito` | Carrito por usuario con validación de stock |
| Contacto / Notificaciones | `contacto-service` | 8086 | `ferreteria_contacto` | Formulario "Escríbenos", respuestas y correos (simulados) |
| Contenido / Novedades | `contenido-service` | 8087 | `ferreteria_contenido` | Noticias de la sección Novedades |

---

## 1. Arquitectura

```
                    Frontend React (http://localhost:5173)
                     │  Authorization: Bearer <accessToken>
   ┌──────────┬──────┼──────────┬───────────┬──────────┬──────────┐
   ▼          ▼      ▼          ▼           ▼          ▼          ▼
 Auth      Usuarios  Productos  Inventario  Carrito   Contacto   Contenido
 :8081     :8082     :8083      :8084       :8085     :8086      :8087
   │          │         │          │           │          │          │
 BD auth   BD usuarios BD prod.  BD invent.  BD carrito BD contacto BD contenido

 Llamadas entre servicios (REST):
   Usuarios  ──► Auth        crea / cambia / elimina la credencial al registrar o editar un usuario
   Productos ──► Inventario  registra el stock inicial al crear un producto y lo borra al eliminarlo
   Carrito   ──► Productos   obtiene nombre, precio e imagen
   Carrito   ──► Inventario  verifica que haya stock antes de agregar unidades
```

**Reglas de la arquitectura:**

- Cada servicio solo lee y escribe **su propia base de datos**. Si necesita datos de otro, los pide por su API.
- Los ids que cruzan servicios (`productoId`, correo del usuario) son **referencias**, no claves foráneas.
- Los 7 servicios comparten la misma clave `jwt.secret`. Por eso **cada uno valida el token por su cuenta**, sin preguntarle a Autenticación en cada petición.
- Las llamadas internas (`/internal`) se protegen con la cabecera `X-Internal-Key`, que solo conocen los microservicios.

### Estructura de cada microservicio

```
src/main/java/cl/losmaestros/<servicio>/
├── model/        Entidades JPA (tablas)
├── repository/   Acceso a datos (Spring Data JPA)
├── dto/          Objetos de entrada/salida con validaciones (@NotBlank, @Email, @Size...)
├── service/      Lógica de negocio
├── controller/   Endpoints REST documentados con Swagger
├── client/       Llamadas a otros microservicios (RestClient)
├── security/     Filtro JWT, reglas de acceso, respuestas 401/403
├── config/       CORS, Swagger, datos iniciales
└── exception/    Manejo centralizado de errores (JSON uniforme)
```

---

## 2. Requisitos

- **JDK 17 o superior** (`java -version`)
- **Maven 3.9+** (`mvn -v`). También sirve abrir cada carpeta en IntelliJ IDEA, que trae Maven incluido.
- **MySQL 8** encendido en `localhost:3306`. Sirve XAMPP, Laragon, MySQL Workbench o Docker (`docker compose up -d` con el archivo incluido).

Por defecto los servicios se conectan con usuario **`root` sin contraseña**. Si tu MySQL tiene otra, defínela antes de iniciar:

```powershell
# PowerShell (vale para la ventana actual)
$env:DB_USER = "root"
$env:DB_PASSWORD = "tu_clave"
```

o cámbiala en `src/main/resources/application.properties` de cada servicio (`spring.datasource.password=`).

**No hay que crear las bases de datos ni las tablas a mano:** cada servicio crea la suya al iniciar (`createDatabaseIfNotExist=true` y `ddl-auto=update`) y carga datos de ejemplo.

---

## 3. Cómo ejecutar

### Opción A: todos de una vez (Windows)

```powershell
powershell -ExecutionPolicy Bypass -File .\iniciar-todos.ps1
```

Abre una ventana por servicio. Inicia primero `auth-service` y luego el resto.

### Opción B: uno por uno

En una terminal por servicio, **empezando por `auth-service`**:

```powershell
cd auth-service
mvn spring-boot:run
```

En IntelliJ: abre la carpeta del servicio y ejecuta la clase `*ServiceApplication`.

### Compilar todo y correr las pruebas

```powershell
mvn clean package
```

---

## 4. Swagger

| Servicio | URL |
|---|---|
| Autenticación | http://localhost:8081/swagger-ui.html |
| Usuarios | http://localhost:8082/swagger-ui.html |
| Productos | http://localhost:8083/swagger-ui.html |
| Inventario | http://localhost:8084/swagger-ui.html |
| Carrito | http://localhost:8085/swagger-ui.html |
| Contacto | http://localhost:8086/swagger-ui.html |
| Contenido | http://localhost:8087/swagger-ui.html |

**Probar un endpoint protegido:**

1. En Swagger de Autenticación, ejecuta `POST /api/auth/login` con una cuenta de prueba.
2. Copia el valor de `accessToken`.
3. En el Swagger del servicio que quieras probar, presiona **Authorize** y pega el token (sin escribir "Bearer").

### Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| ADMIN | `admin@losmaestros.cl` | `Admin123` |
| CLIENTE | `cliente@losmaestros.cl` | `Cliente123` |

---

## 5. Autenticación con JWT y roles

1. `POST /api/auth/login` verifica el correo y la contraseña (guardada con **BCrypt**) y entrega:
   - **accessToken**: JWT firmado (HMAC-SHA) que dura **15 minutos**. Contiene el correo (`sub`), el **rol** (`ADMIN` o `CLIENTE`), el emisor y la fecha de expiración.
   - **refreshToken**: valor aleatorio guardado en la base de datos que dura **7 días**.
2. El frontend envía el access token en cada petición: `Authorization: Bearer <accessToken>`.
3. En cada microservicio, `JwtAuthenticationFilter` valida la firma, el emisor y la expiración, y deja al usuario autenticado con su rol (`ROLE_ADMIN` / `ROLE_CLIENTE`).
4. Las acciones de administrador están protegidas con `@PreAuthorize("hasRole('ADMIN')")`.
5. Cuando el access token expira, el frontend llama a `POST /api/auth/refresh` con el refresh token y recibe tokens nuevos. El refresh token usado **queda revocado** (rotación), así un token robado sirve una sola vez.
6. `POST /api/auth/logout` revoca el refresh token. Cambiar la contraseña, el rol o desactivar la cuenta también revoca las sesiones abiertas.

**Respuestas de seguridad:**
- **401** sin token, token inválido o expirado.
- **403** con token válido pero sin el rol necesario.

---

## 6. Endpoints

Acceso: **Público** = sin token · **Sesión** = cualquier usuario con token · **ADMIN** = token con rol ADMIN · **Interno** = cabecera `X-Internal-Key`.

### Autenticación (8081)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Iniciar sesión |
| POST | `/api/auth/refresh` | Público | Renovar tokens con el refresh token |
| POST | `/api/auth/logout` | Público | Revocar el refresh token |
| GET | `/api/auth/me` | Sesión | Correo y rol de la sesión |
| PUT | `/api/auth/password` | Sesión | Cambiar contraseña |
| GET | `/api/auth/credenciales` | ADMIN | Listar credenciales |
| GET | `/api/auth/credenciales/{id}` | ADMIN | Ver credencial |
| PUT | `/api/auth/credenciales/{id}/rol` | ADMIN | Cambiar rol |
| PUT | `/api/auth/credenciales/{id}/estado` | ADMIN | Activar o desactivar cuenta |
| DELETE | `/api/auth/credenciales/{id}` | ADMIN | Eliminar credencial |
| POST | `/api/auth/internal/credenciales` | Interno | Crear credencial (desde Usuarios) |
| PUT | `/api/auth/internal/credenciales/correo` | Interno | Cambiar correo |
| DELETE | `/api/auth/internal/credenciales?correo=` | Interno | Eliminar credencial |

### Usuarios (8082)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/usuarios/registro` | Público | Crear cuenta de cliente (valida RUN, correo, teléfono, región/comuna y contraseña) |
| GET | `/api/regiones` | Público | Regiones con sus comunas |
| GET | `/api/usuarios/me` | Sesión | Ver mi perfil |
| PUT | `/api/usuarios/me` | Sesión | Editar mi perfil |
| GET | `/api/usuarios` | ADMIN | Listar usuarios |
| GET | `/api/usuarios/{id}` | ADMIN | Ver usuario |
| POST | `/api/usuarios` | ADMIN | Crear usuario con contraseña y rol |
| PUT | `/api/usuarios/{id}` | ADMIN | Editar usuario |
| DELETE | `/api/usuarios/{id}` | ADMIN | Eliminar usuario y su credencial |

### Productos / Catálogo (8083)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/productos?q=&categoriaId=` | Público | Listar y buscar productos |
| GET | `/api/productos/{id}` | Público | Detalle de producto |
| POST | `/api/productos` | ADMIN | Crear producto (con `stockInicial`) |
| PUT | `/api/productos/{id}` | ADMIN | Editar producto |
| DELETE | `/api/productos/{id}` | ADMIN | Eliminar producto (y su stock) |
| GET | `/api/categorias` | Público | Listar categorías |
| GET | `/api/categorias/{id}` | Público | Ver categoría |
| POST | `/api/categorias` | ADMIN | Crear categoría |
| PUT | `/api/categorias/{id}` | ADMIN | Editar categoría |
| DELETE | `/api/categorias/{id}` | ADMIN | Eliminar categoría (409 si tiene productos) |

### Inventario (8084)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/inventario` | Público | Stock de todos los productos |
| GET | `/api/inventario/{productoId}` | Público | Stock de un producto |
| GET | `/api/inventario/{productoId}/disponibilidad?cantidad=` | Público | ¿Hay stock suficiente? |
| GET | `/api/inventario/criticos` | ADMIN | Productos con stock crítico |
| PUT | `/api/inventario/{productoId}` | ADMIN | Fijar stock y stock mínimo |
| POST | `/api/inventario/{productoId}/entradas` | ADMIN | Sumar stock |
| POST | `/api/inventario/{productoId}/salidas` | ADMIN | Restar stock (409 si no alcanza) |
| GET | `/api/inventario/{productoId}/movimientos` | ADMIN | Historial de movimientos |
| DELETE | `/api/inventario/{productoId}` | ADMIN | Eliminar stock |
| POST | `/api/inventario/internal` | Interno | Stock inicial (desde Productos) |
| DELETE | `/api/inventario/internal/{productoId}` | Interno | Borrar stock (desde Productos) |

### Carrito (8085)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/carrito` | Sesión | Ver mi carrito con subtotales y total |
| POST | `/api/carrito/items` | Sesión | Agregar producto (409 si supera el stock) |
| PUT | `/api/carrito/items/{productoId}` | Sesión | Cambiar cantidad |
| DELETE | `/api/carrito/items/{productoId}` | Sesión | Quitar producto |
| DELETE | `/api/carrito` | Sesión | Vaciar carrito |

### Contacto / Notificaciones (8086)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/contacto` | Público | Enviar consulta (acuse al cliente y aviso al admin) |
| GET | `/api/contacto/mias` | Sesión | Mis consultas y respuestas |
| GET | `/api/contacto?estado=` | ADMIN | Listar consultas |
| GET | `/api/contacto/{id}` | ADMIN | Ver consulta |
| PUT | `/api/contacto/{id}/respuesta` | ADMIN | Responder (notifica al cliente) |
| PUT | `/api/contacto/{id}/estado` | ADMIN | Cambiar estado |
| DELETE | `/api/contacto/{id}` | ADMIN | Eliminar consulta |
| GET | `/api/notificaciones` | ADMIN | Correos enviados |

> El envío de correos es **simulado**: se guardan en la tabla `notificaciones` y aparecen en la consola del servicio. Para enviar correos reales se puede reemplazar `NotificacionService` por uno que use `JavaMailSender`.

### Contenido / Novedades (8087)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/noticias` | Público | Noticias publicadas (`?todas=true` solo ADMIN) |
| GET | `/api/noticias/{id}` | Público | Detalle de noticia |
| POST | `/api/noticias` | ADMIN | Crear noticia |
| PUT | `/api/noticias/{id}` | ADMIN | Editar o publicar/ocultar |
| DELETE | `/api/noticias/{id}` | ADMIN | Eliminar noticia |

---

## 7. Lógica de negocio destacada

- **RUN chileno** validado con dígito verificador (módulo 11), igual que el frontend. Tiene prueba unitaria en `usuarios-service`.
- **Registro**: no permite correos ni RUN repetidos, exige una comuna que pertenezca a la región, un teléfono de al menos 8 dígitos y una contraseña de 8 a 64 caracteres con letras y números. Si Autenticación falla, el perfil no se guarda (la transacción se revierte).
- **Stock**: nunca queda negativo. El carrito **no permite agregar más unidades de las disponibles**, una validación que el frontend no tenía.
- **Productos críticos**: el stock menor o igual al stock mínimo aparece en `/api/inventario/criticos`.
- **Categorías**: no se puede eliminar una categoría que todavía tiene productos.
- **Administradores**: no pueden quitarse su propio rol, desactivarse ni eliminarse a sí mismos.
- **Errores**: todos los servicios responden con el mismo formato JSON:

```json
{
  "timestamp": "2026-11-23T22:30:00Z",
  "status": 409,
  "error": "Conflict",
  "mensaje": "Stock insuficiente: quedan 8 unidad(es).",
  "ruta": "/api/carrito/items"
}
```

---

## 8. Datos iniciales

Al iniciar por primera vez, cada servicio carga los mismos datos que tenía el frontend:

- **Autenticación**: cuentas admin y cliente de prueba.
- **Usuarios**: perfiles del admin, el cliente de prueba, Juan Pérez y María González. Estos dos últimos no tienen credencial, igual que en el frontend.
- **Productos**: 6 categorías y los 8 productos del catálogo, con ids 1 a 8.
- **Inventario**: stock de los productos 1 a 8 (150, 12, 25, 8, 30, 42, 18 y 65 unidades).
- **Contenido**: las 4 noticias de Novedades.

> El stock inicial asume que Productos asignó los ids 1 a 8. Si borras solo una de las dos bases de datos, borra también la otra para que vuelvan a coincidir.

---

## 9. Variables de entorno (opcionales)

| Variable | Valor por defecto | Uso |
|---|---|---|
| `DB_HOST` / `DB_PORT` | `localhost` / `3306` | Servidor MySQL |
| `DB_USER` / `DB_PASSWORD` | `root` / *(vacía)* | Credenciales MySQL |
| `JWT_SECRET` | clave de desarrollo | **Debe ser igual en los 7 servicios** (mínimo 32 caracteres) |
| `INTERNAL_KEY` | `clave-interna-los-maestros` | Clave para llamadas entre servicios (igual en todos) |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Orígenes del frontend permitidos |
| `AUTH_URL`, `PRODUCTOS_URL`, `INVENTARIO_URL` | `http://localhost:808X` | Dirección de los otros servicios |
| `PORT` | 8081–8087 | Puerto del servicio |
