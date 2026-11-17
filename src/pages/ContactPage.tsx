type ContactForm = {
  nombre: string
  correo: string
  mensaje: string
}

type ContactPageProps = {
  form: ContactForm
  message: string
  onChange: (next: ContactForm) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function ContactPage({ form, message, onChange, onSubmit }: ContactPageProps) {
  return (
    <section className="section-block contact-layout">
      <div className="contact-card">
        <div className="section-heading">
          <p className="eyebrow">Contacto</p>
          <h2>Escríbenos</h2>
        </div>
        <form onSubmit={onSubmit} className="form-box">
          <label>
            Nombre
            <input value={form.nombre} onChange={(e) => onChange({ ...form, nombre: e.target.value })} />
          </label>
          <label>
            Correo
            <input value={form.correo} onChange={(e) => onChange({ ...form, correo: e.target.value })} />
          </label>
          <label>
            Mensaje
            <textarea value={form.mensaje} onChange={(e) => onChange({ ...form, mensaje: e.target.value })} rows={5} />
          </label>
          {message && <p className="form-message">{message}</p>}
          <button type="submit" className="btn btn-primary">Enviar consulta</button>
        </form>
      </div>

      <div className="contact-card info-card-box">
        <h3>Ferretería Los Maestros</h3>
        <p>Dirección: Av. del Mar 123, La Serena</p>
        <p>Teléfono: +56 9 1234 5678</p>
        <p>Horario: Lunes a sábado / 8:00 a 19:00</p>
      </div>
    </section>
  )
}
