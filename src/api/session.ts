// Gestión de la sesión del usuario en el frontend.
//
// - Guarda los tokens que entrega auth-service (access token JWT + refresh token).
// - Persiste en localStorage para que la sesión siga activa al recargar la página.
// - Avisa a React cada vez que la sesión cambia (login, renovación o cierre).
// - Sincroniza varias pestañas abiertas: si cierras sesión en una, se cierra en todas.

export type Rol = 'ADMIN' | 'CLIENTE'

export type Sesion = {
  accessToken: string
  refreshToken: string
  correo: string
  rol: Rol
  /** Momento (en milisegundos) en que vence el access token. */
  expiraEn: number
}

const CLAVE = 'los_maestros_sesion'

function leer(): Sesion | null {
  try {
    const guardada = localStorage.getItem(CLAVE)
    if (!guardada) return null
    const sesion = JSON.parse(guardada) as Sesion
    if (!sesion.accessToken || !sesion.refreshToken || (sesion.rol !== 'ADMIN' && sesion.rol !== 'CLIENTE')) {
      return null
    }
    return sesion
  } catch {
    return null
  }
}

let actual: Sesion | null = leer()
const oyentes = new Set<() => void>()

function notificar() {
  oyentes.forEach((oyente) => oyente())
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (evento) => {
    if (evento.key === CLAVE || evento.key === null) {
      actual = leer()
      notificar()
    }
  })
}

export const sesionStore = {
  obtener(): Sesion | null {
    return actual
  },

  guardar(sesion: Sesion) {
    actual = sesion
    try {
      localStorage.setItem(CLAVE, JSON.stringify(sesion))
    } catch {
      // Si el navegador bloquea el almacenamiento, la sesión dura mientras la pestaña esté abierta.
    }
    notificar()
  },

  limpiar() {
    actual = null
    try {
      localStorage.removeItem(CLAVE)
    } catch {
      // nada que limpiar
    }
    notificar()
  },

  /** Vuelve a leer la sesión guardada (útil al iniciar la app o en pruebas). */
  recargar() {
    actual = leer()
    notificar()
  },

  suscribir(oyente: () => void) {
    oyentes.add(oyente)
    return () => {
      oyentes.delete(oyente)
    }
  },
}
