type RegisterForm = {
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

type RegisterPageProps = {
  form: RegisterForm
  message: string
  regiones: Array<{ nombre: string; comunas: string[] }>
  onChange: (next: RegisterForm) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onOpenLogin: () => void
}

export function RegisterPage({ form, message, regiones, onChange, onSubmit, onOpenLogin }: RegisterPageProps) {
  return (
    <section className="section-block form-layout">
      <div className="form-card wide-form">
        <div className="section-heading">
          <p className="eyebrow">Registro</p>
          <h2>Crea tu cuenta</h2>
        </div>
        <form onSubmit={onSubmit} className="form-box">
          <div className="two-columns">
            <label>
              RUN
              <input autoComplete="off" value={form.run} onChange={(e) => onChange({ ...form, run: e.target.value })} required />
            </label>
            <label>
              Nombre
              <input autoComplete="given-name" value={form.nombre} onChange={(e) => onChange({ ...form, nombre: e.target.value })} required />
            </label>
            <label>
              Apellidos
              <input autoComplete="family-name" value={form.apellidos} onChange={(e) => onChange({ ...form, apellidos: e.target.value })} required />
            </label>
            <label>
              Correo
              <input type="email" autoComplete="email" value={form.correo} onChange={(e) => onChange({ ...form, correo: e.target.value })} required />
            </label>
            <label>
              Teléfono de contacto
              <input type="tel" autoComplete="tel" value={form.telefono} onChange={(e) => onChange({ ...form, telefono: e.target.value })} placeholder="+56 9 1234 5678" required />
            </label>
            <label>
              Tipo de usuario
              <select value={form.tipo} onChange={(e) => onChange({ ...form, tipo: e.target.value })} required>
                <option value="">Seleccione</option>
                <option value="Contratista">Contratista</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Cliente">Cliente</option>
              </select>
            </label>
            <label>
              Región
              <select autoComplete="address-level1" value={form.region} onChange={(e) => onChange({ ...form, region: e.target.value, comuna: '' })} required>
                <option value="">Seleccione región</option>
                {regiones.map((region) => (
                  <option key={region.nombre} value={region.nombre}>{region.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Comuna
              <select autoComplete="address-level2" value={form.comuna} onChange={(e) => onChange({ ...form, comuna: e.target.value })} disabled={!form.region} required>
                <option value="">Seleccione comuna</option>
                {regiones.find((region) => region.nombre === form.region)?.comunas.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
            </label>
            <label>
              Dirección
              <input autoComplete="street-address" value={form.direccion} onChange={(e) => onChange({ ...form, direccion: e.target.value })} required />
            </label>
            <label>
              Contraseña
              <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => onChange({ ...form, password: e.target.value })} minLength={8} required />
            </label>
            <label>
              Repite tu contraseña
              <input type="password" autoComplete="new-password" value={form.confirmarPassword} onChange={(e) => onChange({ ...form, confirmarPassword: e.target.value })} minLength={8} required />
            </label>
          </div>
          <small className="form-help">Usa al menos 8 caracteres e incluye letras y números.</small>
          {message && <p className="form-message">{message}</p>}
          <button type="submit" className="btn btn-primary">Crear mi cuenta</button>
          <p className="account-switch">¿Ya tienes cuenta? <button type="button" onClick={onOpenLogin}>Iniciar sesión</button></p>
        </form>
      </div>
    </section>
  )
}
