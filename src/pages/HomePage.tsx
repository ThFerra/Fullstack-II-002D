import { Button } from '../components/atoms/Button'
import { SectionHeading } from '../components/atoms/SectionHeading'
import { InfoCard } from '../components/molecules/InfoCard'
import { CategoryCard } from '../components/molecules/CategoryCard'
import { ProductCard } from '../components/molecules/ProductCard'
import { categories, products, benefits } from '../data/store'

type HomePageProps = {
  onOpenCatalog: () => void
  onOpenAbout: () => void
}

export function HomePage({ onOpenCatalog, onOpenAbout }: HomePageProps) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Todo para construir, reparar y mejorar</p>
          <h1>Materiales de construcción, herramientas y ferretería general.</h1>
          <p>
            22 años al servicio de particulares y contratistas en La Serena con productos para obra,
            hogar y mantenimiento.
          </p>
          <div className="hero-actions">
            <Button onClick={onOpenCatalog}>Ver catálogo</Button>
            <Button variant="secondary" onClick={onOpenAbout}>Nuestra historia</Button>
          </div>
          <div className="stats-grid">
            <div><strong>+1,200</strong><span>Productos</span></div>
            <div><strong>15 años</strong><span>Experiencia</span></div>
            <div><strong>4.9/5</strong><span>Clientes</span></div>
          </div>
        </div>

        <div className="hero-panel">
          <span className="panel-badge">Entrega hoy</span>
          <h2>Lo que más compran</h2>
          <ul className="mini-list">
            <li><span>🧱</span><div><strong>Cemento</strong><small>Desde $4.890</small></div></li>
            <li><span>🔧</span><div><strong>Taladro Percutor</strong><small>Desde $79.990</small></div></li>
            <li><span>🎨</span><div><strong>Pintura Látex</strong><small>Desde $18.990</small></div></li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <SectionHeading eyebrow="Nuestras categorías" title="Todo lo que necesitas en un solo lugar" />
        <div className="cards-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              icon={category.icon}
              title={category.title}
              description={category.description}
            />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeading eyebrow="Productos destacados" title="Recomendados para ti" />
        <div className="product-grid row g-4">
          {products.slice(0, 3).map((product) => (
            <article className="col-12 col-md-6 col-lg-4" key={product.name}>
              <ProductCard name={product.name} price={product.price} tag={product.tag} />
            </article>
          ))}
        </div>
      </section>

      <section className="section-block benefits-grid">
        <div>
          <SectionHeading eyebrow="¿Por qué elegirnos?" title="Soluciones confiables para obra, hogar y negocio" />
          <p className="lead-text">
            Somos una ferretería con enfoque en servicio, rapidez y calidad. Trabajamos con materiales
            durables y acompañamos cada compra con asesoría experta para proyectos reales.
          </p>
          <ul className="benefits-list">
            {benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="info-boxes">
          <div className="mini-box">
            <span>Horario</span>
            <strong>Lun - Sab</strong>
            <small>8:00 AM - 7:00 PM</small>
          </div>
          <div className="mini-box accent">
            <span>Atención</span>
            <strong>Presupuesto gratis</strong>
            <small>Sin compromiso</small>
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionHeading eyebrow="Servicio" title="Atención integral" />
        <div className="cards-grid">
          {[
            { icon: '🧰', title: 'Variedad', description: 'Productos para obra, hogar y mantenimiento.' },
            { icon: '🤝', title: 'Asesoría', description: 'Te ayudamos a elegir lo necesario para cada tarea.' },
            { icon: '📍', title: 'Local', description: 'Con atención cercana en La Serena y la región.' },
          ].map((item) => (
            <InfoCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </section>
    </>
  )
}
