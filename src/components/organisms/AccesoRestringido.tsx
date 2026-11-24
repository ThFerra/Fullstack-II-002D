type AccesoRestringidoProps = {
  titulo: string
  mensaje: string
  textoBoton?: string
  onAccion?: () => void
}

/**
 * Pantalla que se muestra cuando el usuario intenta entrar a una sección
 * para la que no tiene sesión o no tiene el rol necesario.
 */
export function AccesoRestringido({ titulo, mensaje, textoBoton, onAccion }: AccesoRestringidoProps) {
  return (
    <section className="section-block profile-layout">
      <div className="profile-card profile-guest acceso-restringido" role="alert">
        <p className="eyebrow">Acceso restringido</p>
        <h2>{titulo}</h2>
        <p>{mensaje}</p>
        {textoBoton && onAccion && (
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={onAccion}>{textoBoton}</button>
          </div>
        )}
      </div>
    </section>
  )
}
