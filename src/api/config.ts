// Direcciones de los microservicios del backend.
// Se pueden cambiar sin tocar el código creando un archivo .env (ver .env.example).
const env: Record<string, string | undefined> = import.meta.env ?? {}

export const API = {
  auth: env.VITE_AUTH_URL ?? 'http://localhost:8081',
  usuarios: env.VITE_USUARIOS_URL ?? 'http://localhost:8082',
  productos: env.VITE_PRODUCTOS_URL ?? 'http://localhost:8083',
  inventario: env.VITE_INVENTARIO_URL ?? 'http://localhost:8084',
  carrito: env.VITE_CARRITO_URL ?? 'http://localhost:8085',
  contacto: env.VITE_CONTACTO_URL ?? 'http://localhost:8086',
  contenido: env.VITE_CONTENIDO_URL ?? 'http://localhost:8087',
}
