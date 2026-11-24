// Funciones para llamar a cada microservicio.
// Cada función corresponde a un endpoint documentado en Swagger.

import { API } from './config'
import { apiFetch, type TokenResponse } from './http'

// ---------- Tipos que devuelve el backend ----------

export type UsuarioApi = {
  id: number
  run: string
  nombre: string
  apellidos: string | null
  correo: string
  telefono: string | null
  tipo: string
  region: string | null
  comuna: string | null
  direccion: string | null
  creadoEn: string
}

export type ProductoApi = {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  imagen: string | null
  categoriaId: number
  categoria: string
}

export type CategoriaApi = { id: number; nombre: string; descripcion: string | null }

export type StockApi = {
  productoId: number
  cantidad: number
  stockMinimo: number
  critico: boolean
  actualizadoEn: string
}

export type ItemCarritoApi = {
  productoId: number
  nombre: string
  imagen: string | null
  precioUnitario: number
  cantidad: number
  subtotal: number
}

export type CarritoApi = { usuario: string; items: ItemCarritoApi[]; totalUnidades: number; total: number }

export type NoticiaApi = {
  id: number
  titulo: string
  imagen: string | null
  imagenAlt: string | null
  resumen: string
  detalle: string
  publicada: boolean
}

export type RegionApi = { nombre: string; comunas: string[] }

// ---------- Datos que se envían ----------

export type RegistroDatos = {
  run: string
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  tipo: string
  region: string
  comuna: string
  direccion: string
  password: string
  confirmarPassword: string
}

export type PerfilDatos = {
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  region: string
  comuna: string
  direccion: string
}

export type UsuarioAdminDatos = {
  run: string
  nombre: string
  apellidos?: string | null
  correo: string
  telefono?: string | null
  tipo: string
  region?: string | null
  comuna?: string | null
  direccion?: string | null
  password?: string
  rol?: 'ADMIN' | 'CLIENTE'
}

export type ProductoDatos = {
  nombre: string
  descripcion?: string | null
  precio: number
  imagen?: string | null
  categoriaId: number
  stockInicial?: number
}

// ---------- Autenticación (8081) ----------

export const authApi = {
  login: (correo: string, password: string) =>
    apiFetch<TokenResponse>(`${API.auth}/api/auth/login`, { method: 'POST', body: { correo, password } }),

  logout: (refreshToken: string) =>
    apiFetch<unknown>(`${API.auth}/api/auth/logout`, { method: 'POST', body: { refreshToken } }),
}

// ---------- Usuarios (8082) ----------

export const usuariosApi = {
  regiones: () => apiFetch<RegionApi[]>(`${API.usuarios}/api/regiones`),

  registrar: (datos: RegistroDatos) =>
    apiFetch<UsuarioApi>(`${API.usuarios}/api/usuarios/registro`, { method: 'POST', body: datos }),

  miPerfil: () => apiFetch<UsuarioApi>(`${API.usuarios}/api/usuarios/me`, { auth: true }),

  actualizarMiPerfil: (datos: PerfilDatos) =>
    apiFetch<UsuarioApi>(`${API.usuarios}/api/usuarios/me`, { method: 'PUT', body: datos, auth: true }),

  listar: () => apiFetch<UsuarioApi[]>(`${API.usuarios}/api/usuarios`, { auth: true }),

  crear: (datos: UsuarioAdminDatos) =>
    apiFetch<UsuarioApi>(`${API.usuarios}/api/usuarios`, { method: 'POST', body: datos, auth: true }),

  actualizar: (id: number, datos: UsuarioAdminDatos) =>
    apiFetch<UsuarioApi>(`${API.usuarios}/api/usuarios/${id}`, { method: 'PUT', body: datos, auth: true }),

  eliminar: (id: number) =>
    apiFetch<void>(`${API.usuarios}/api/usuarios/${id}`, { method: 'DELETE', auth: true }),
}

// ---------- Productos / Catálogo (8083) ----------

export const productosApi = {
  listar: () => apiFetch<ProductoApi[]>(`${API.productos}/api/productos`),

  categorias: () => apiFetch<CategoriaApi[]>(`${API.productos}/api/categorias`),

  crear: (datos: ProductoDatos) =>
    apiFetch<ProductoApi>(`${API.productos}/api/productos`, { method: 'POST', body: datos, auth: true }),

  actualizar: (id: number, datos: ProductoDatos) =>
    apiFetch<ProductoApi>(`${API.productos}/api/productos/${id}`, { method: 'PUT', body: datos, auth: true }),

  eliminar: (id: number) =>
    apiFetch<void>(`${API.productos}/api/productos/${id}`, { method: 'DELETE', auth: true }),
}

// ---------- Inventario (8084) ----------

export const inventarioApi = {
  listar: () => apiFetch<StockApi[]>(`${API.inventario}/api/inventario`),

  fijarStock: (productoId: number, cantidad: number) =>
    apiFetch<StockApi>(`${API.inventario}/api/inventario/${productoId}`, {
      method: 'PUT',
      body: { cantidad, motivo: 'Actualizado desde el panel administrador' },
      auth: true,
    }),
}

// ---------- Carrito (8085) ----------

export const carritoApi = {
  ver: () => apiFetch<CarritoApi>(`${API.carrito}/api/carrito`, { auth: true }),

  agregar: (productoId: number, cantidad = 1) =>
    apiFetch<CarritoApi>(`${API.carrito}/api/carrito/items`, { method: 'POST', body: { productoId, cantidad }, auth: true }),

  quitar: (productoId: number) =>
    apiFetch<CarritoApi>(`${API.carrito}/api/carrito/items/${productoId}`, { method: 'DELETE', auth: true }),

  vaciar: () => apiFetch<CarritoApi>(`${API.carrito}/api/carrito`, { method: 'DELETE', auth: true }),
}

// ---------- Contacto (8086) ----------

export const contactoApi = {
  enviar: (datos: { nombre: string; correo: string; mensaje: string }) =>
    apiFetch<{ mensaje: string; consultaId: number }>(`${API.contacto}/api/contacto`, { method: 'POST', body: datos }),
}

// ---------- Contenido / Novedades (8087) ----------

export const contenidoApi = {
  noticias: () => apiFetch<NoticiaApi[]>(`${API.contenido}/api/noticias`),
}
