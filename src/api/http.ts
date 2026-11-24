// Cliente HTTP común para hablar con los microservicios.
//
// - Agrega la cabecera "Authorization: Bearer <token>" en las peticiones privadas.
// - Si el token está por vencer (o el servidor responde 401), lo renueva una sola vez
//   con el refresh token y repite la petición, sin que el usuario lo note.
// - Convierte los errores del backend en ApiError con el mensaje que muestra la interfaz.

import { API } from './config'
import { sesionStore, type Rol, type Sesion } from './session'

export type TokenResponse = {
  accessToken: string
  refreshToken: string
  tipo: string
  expiraEnSegundos: number
  correo: string
  rol: string
}

export class ApiError extends Error {
  readonly status: number
  readonly campos?: Record<string, string>

  constructor(status: number, mensaje: string, campos?: Record<string, string>) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.campos = campos
  }
}

type Opciones = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  /** true = la petición necesita el token del usuario. */
  auth?: boolean
}

/** Margen para renovar el token antes de que venza. */
const MARGEN_RENOVACION_MS = 30_000

export function aSesion(token: TokenResponse): Sesion {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    correo: token.correo,
    rol: token.rol as Rol,
    expiraEn: Date.now() + token.expiraEnSegundos * 1000,
  }
}

// Si varias peticiones detectan el token vencido al mismo tiempo, comparten una sola renovación.
let renovacionEnCurso: Promise<boolean> | null = null

export function renovarSesion(): Promise<boolean> {
  const sesion = sesionStore.obtener()
  if (!sesion) return Promise.resolve(false)

  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      try {
        const respuesta = await fetch(`${API.auth}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: sesion.refreshToken }),
        })
        if (!respuesta.ok) {
          // El refresh token venció o fue revocado: la sesión terminó.
          sesionStore.limpiar()
          return false
        }
        sesionStore.guardar(aSesion((await respuesta.json()) as TokenResponse))
        return true
      } catch {
        return false
      } finally {
        renovacionEnCurso = null
      }
    })()
  }
  return renovacionEnCurso
}

async function enviar(url: string, method: string, body: unknown, auth: boolean): Promise<Response> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const sesion = sesionStore.obtener()
  if (auth && sesion) headers.Authorization = `Bearer ${sesion.accessToken}`

  try {
    return await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.')
  }
}

async function aApiError(respuesta: Response): Promise<ApiError> {
  let mensaje = `Error ${respuesta.status} al comunicarse con el servidor.`
  let campos: Record<string, string> | undefined
  try {
    const cuerpo = (await respuesta.json()) as { mensaje?: string; campos?: Record<string, string> }
    if (cuerpo?.mensaje) mensaje = cuerpo.mensaje
    campos = cuerpo?.campos
    // Si el error trae detalle por campo, se muestra ese mensaje porque es más específico.
    const primerCampo = campos ? Object.values(campos)[0] : undefined
    if (primerCampo) mensaje = primerCampo
  } catch {
    // La respuesta no era JSON: se usa el mensaje genérico.
  }
  return new ApiError(respuesta.status, mensaje, campos)
}

export async function apiFetch<T>(url: string, opciones: Opciones = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = opciones

  // Renovación preventiva: evita mandar un token que está a punto de vencer.
  const sesion = sesionStore.obtener()
  if (auth && sesion && sesion.expiraEn - Date.now() < MARGEN_RENOVACION_MS) {
    await renovarSesion()
  }

  let respuesta = await enviar(url, method, body, auth)

  // Token rechazado: se intenta renovar una vez y se repite la petición.
  if (respuesta.status === 401 && auth && sesionStore.obtener()) {
    const renovada = await renovarSesion()
    if (renovada) {
      respuesta = await enviar(url, method, body, auth)
    }
  }

  if (!respuesta.ok) {
    throw await aApiError(respuesta)
  }
  if (respuesta.status === 204) {
    return undefined as T
  }
  const texto = await respuesta.text()
  return (texto ? JSON.parse(texto) : undefined) as T
}

/** Devuelve el mensaje que se puede mostrar al usuario para cualquier error. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'Ocurrió un error inesperado. Intenta nuevamente.'
}
