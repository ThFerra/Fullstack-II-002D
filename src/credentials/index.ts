export type UserRecord = {
  id: number
  run: string
  nombre: string
  correo: string
  rol: string
}

export type CustomerAccount = {
  id: number
  run: string
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  tipo: string
  region: string
  comuna: string
  direccion: string
  passwordSalt: string
  passwordHash: string
}

export const defaultUsers: UserRecord[] = [
  { id: 1, run: '12345678K', nombre: 'Juan Pérez', correo: 'juan.perez@email.com', rol: 'Contratista' },
  { id: 2, run: '18765432-1', nombre: 'María González', correo: 'maria.g@email.com', rol: 'Vendedor' },
]

export const demoCustomerAccount: CustomerAccount = {
  id: 0,
  run: '',
  nombre: 'Cliente',
  apellidos: 'de prueba',
  correo: 'cliente@losmaestros.cl',
  telefono: '',
  tipo: 'Cliente',
  region: 'Coquimbo',
  comuna: 'La Serena',
  direccion: '',
  passwordSalt: '',
  passwordHash: '',
}

export const createPasswordHash = async (password: string, salt?: string) => {
  const passwordSalt = salt ?? crypto.randomUUID()
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(passwordSalt), iterations: 30_000, hash: 'SHA-256' },
    key,
    256,
  )
  const passwordHash = btoa(String.fromCharCode(...new Uint8Array(hash)))
  return { passwordSalt, passwordHash }
}

export const regionesChile = [
  { nombre: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre'] },
  { nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte'] },
  { nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Vicuña'] },
  { nombre: 'Metropolitana de Santiago', comunas: ['Santiago', 'Maipú', 'Puente Alto'] },
]
