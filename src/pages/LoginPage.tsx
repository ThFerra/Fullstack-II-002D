type LoginPageProps = {
  correo: string
  password: string
  message: string
  onChange: (field: 'correo' | 'password', value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onOpenRegister: () => void
}

export function LoginPage({ correo, password, message, onChange, onSubmit, onOpenRegister }: LoginPageProps) {
  return (
    <section className="section-block form-layout">
      <div className="form-card">
        <div className="section-heading">
          <p className="eyebrow">Iniciar sesión</p>
          <h2>Accede a tu cuenta</h2>
        </div>
        <form onSubmit={onSubmit} className="form-box">
          <label>
            Correo
            <input type="email" autoComplete="email" value={correo} onChange={(e) => onChange('correo', e.target.value)} />
          </label>
          <label>
            Contraseña
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => onChange('password', e.target.value)} />
          </label>
          {message && <p className="form-message">{message}</p>}
          <button type="submit" className="btn btn-primary">Ingresar</button>
          <p className="account-switch">¿Todavía no tienes cuenta? <button type="button" onClick={onOpenRegister}>Crear cuenta</button></p>
        </form>
      </div>
    </section>
  )
}
