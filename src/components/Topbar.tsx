export function Topbar() {
  return (
    <header className="topbar">
      <div className="brand" aria-label="Ferretería Los Maestro">
        <div className="brand-mark">LM</div>
        <div>
          <span className="brand-name">Los Maestro</span>
          <small>Ferretería & materiales</small>
        </div>
      </div>

      <nav className="nav" aria-label="Navegación principal">
        <a href="#inicio">Inicio</a>
        <a href="#categorias">Categorías</a>
        <a href="#productos">Productos</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <a className="btn btn-primary" href="#contacto">
        Cotizar ahora
      </a>
    </header>
  )
}
