type InfoCardProps = {
  icon: string
  title: string
  description: string
}

export function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <article className="info-card">
      <div className="card-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
