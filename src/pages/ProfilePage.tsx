type CustomerAccountLike = {
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

type ProfileForm = {
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  region: string
  comuna: string
  direccion: string
}

type ProfilePageProps = {
  activeAccount: CustomerAccountLike | null
  profileForm: ProfileForm
  profileMessage: string
  regiones: Array<{ nombre: string; comunas: string[] }>
  onOpenLogin: () => void
  onOpenRegister: () => void
  onLogout: () => void
  onChange: (next: ProfileForm) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function ProfilePage({
  activeAccount,
  profileForm,
  profileMessage,
  regiones,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onChange,
  onSubmit,
}: ProfilePageProps) {
  if (!activeAccount) {
    return (
      <section className="section-block profile-layout">
        <div className="profile-card profile-guest">
          <p className="eyebrow">Tu cuenta</p>
          <h2>Ingresa para ver tu perfil</h2>
          <p>Inicia sesión o crea una cuenta para guardar tus datos y dirección de contacto.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={onOpenLogin}>Iniciar sesión</button>
            <button type="button" className="btn btn-secondary" onClick={onOpenRegister}>Crear cuenta</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-block profile-layout">
      <div className="profile-card profile-account-card">
        <div className="profile-heading-row">
          <div>
            <p className="eyebrow">Mi cuenta</p>
            <h2>Hola, {activeAccount.nombre}</h2>
            <p className="profile-email">Administra tus datos y dirección de contacto.</p>
          </div>
          <button type="button" className="btn btn-outline-secondary" onClick={onLogout}>Cerrar sesión</button>
        </div>

        <div className="account-summary-grid">
          <div className="account-summary-item"><span>Cuenta</span><strong>{activeAccount.tipo || 'Cliente'}</strong></div>
          <div className="account-summary-item"><span>Correo registrado</span><strong>{activeAccount.correo}</strong></div>
          <div className="account-summary-item"><span>Dirección</span><strong>{activeAccount.direccion || 'Agrega tu dirección'}</strong></div>
        </div>

        <form className="form-box profile-edit-form" onSubmit={onSubmit}>
          <div className="profile-section-heading">
            <h3>Datos personales y dirección</h3>
            <p>Estos datos se guardan en esta cuenta para futuras visitas.</p>
          </div>
          <div className="two-columns">
            <label>Nombre<input autoComplete="given-name" value={profileForm.nombre} onChange={(event) => onChange({ ...profileForm, nombre: event.target.value })} required /></label>
            <label>Apellidos<input autoComplete="family-name" value={profileForm.apellidos} onChange={(event) => onChange({ ...profileForm, apellidos: event.target.value })} required /></label>
            <label>Correo electrónico<input type="email" autoComplete="email" value={profileForm.correo} onChange={(event) => onChange({ ...profileForm, correo: event.target.value })} required /></label>
            <label>Teléfono<input type="tel" autoComplete="tel" value={profileForm.telefono} onChange={(event) => onChange({ ...profileForm, telefono: event.target.value })} required /></label>
            <label>Región<select autoComplete="address-level1" value={profileForm.region} onChange={(event) => onChange({ ...profileForm, region: event.target.value, comuna: '' })} required>
              <option value="">Selecciona región</option>
              {regiones.map((region) => <option key={region.nombre} value={region.nombre}>{region.nombre}</option>)}
            </select></label>
            <label>Comuna<select autoComplete="address-level2" value={profileForm.comuna} onChange={(event) => onChange({ ...profileForm, comuna: event.target.value })} disabled={!profileForm.region} required>
              <option value="">Selecciona comuna</option>
              {regiones.find((region) => region.nombre === profileForm.region)?.comunas.map((comuna) => <option key={comuna} value={comuna}>{comuna}</option>)}
            </select></label>
            <label className="full-span">Dirección<input autoComplete="street-address" value={profileForm.direccion} onChange={(event) => onChange({ ...profileForm, direccion: event.target.value })} required /></label>
          </div>
          {profileMessage && <p className="form-message" role="status">{profileMessage}</p>}
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </form>
      </div>
    </section>
  )
}
