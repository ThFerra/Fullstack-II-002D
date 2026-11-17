type SiteTemplateProps = {
  header: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

export function SiteTemplate({ header, children, footer }: SiteTemplateProps) {
  return (
    <div className="app-shell">
      {header}
      <main className="page-content container">{children}</main>
      {footer ?? (
        <footer className="site-footer">
          <p>© 2026 Ferretería Los Maestros - La Serena, Región de Coquimbo. Todos los derechos reservados.</p>
        </footer>
      )}
    </div>
  )
}
