import { Button } from '../components/atoms/Button'

type AboutPageProps = {
  onOpenCatalog: () => void
  onOpenContact: () => void
}

export function AboutPage({ onOpenCatalog, onOpenContact }: AboutPageProps) {
  return (
    <>
      <section className="about-hero">
        <div className="about-copy">
          <p className="eyebrow">Ferretería Los Maestros · La Serena</p>
          <h1>Nuestra historia y compromiso</h1>
          <p>
            Llevamos más de 22 años brindando soluciones en herramientas, materiales de construcción
            y ferretería general a particulares y contratistas de la Región de Coquimbo.
          </p>
          <p>
            Queremos que cada persona encuentre los materiales adecuados para construir, reparar y
            mejorar, con atención cercana y orientación para sus proyectos.
          </p>
          <div className="hero-actions">
            <Button onClick={onOpenCatalog}>Explorar catálogo</Button>
            <Button variant="secondary" onClick={onOpenContact}>Contáctanos</Button>
          </div>
        </div>
        <div className="about-brand-panel" aria-label="Ferretería Los Maestros en La Serena">
          <img src="/img/Captura%20de%20pantalla%202026-10-24%20195817.png" alt="Logotipo de Ferretería Los Maestros" />
          <strong>Experiencia que construye confianza</strong>
          <span>Atención a particulares y contratistas</span>
        </div>
      </section>

      <section className="section-block about-values">
        <div className="section-heading">
          <p className="eyebrow">Lo que nos mueve</p>
          <h2>Un aliado para cada proyecto</h2>
          <p className="about-section-intro">
            Desde una reparación en casa hasta el abastecimiento de una obra, nuestro propósito es
            ofrecer productos confiables y una atención que ayude a avanzar.
          </p>
        </div>
        <div className="row g-4">
          <article className="col-12 col-md-4">
            <div className="about-value-card h-100">
              <span className="about-value-icon">🧰</span>
              <h3>Variedad</h3>
              <p>Herramientas, materiales y artículos de ferretería para distintas necesidades.</p>
            </div>
          </article>
          <article className="col-12 col-md-4">
            <div className="about-value-card h-100">
              <span className="about-value-icon">🤝</span>
              <h3>Atención cercana</h3>
              <p>Orientación para que puedas elegir lo que mejor se adapta a tu trabajo.</p>
            </div>
          </article>
          <article className="col-12 col-md-4">
            <div className="about-value-card h-100">
              <span className="about-value-icon">📍</span>
              <h3>Compromiso local</h3>
              <p>Al servicio de La Serena y la Región de Coquimbo desde hace más de dos décadas.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="about-project section-block">
        <div>
          <p className="eyebrow">Nuestro sitio</p>
          <h2>Una experiencia simple para encontrar lo que necesitas</h2>
          <p>
            Este proyecto reúne el catálogo, la selección de productos y los canales de contacto en
            un solo lugar. Revisa los productos disponibles y prepara tu solicitud de compra.
          </p>
        </div>
        <Button onClick={onOpenCatalog}>Ver productos</Button>
      </section>
    </>
  )
}
