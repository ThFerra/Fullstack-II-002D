type CategoryCardProps = {
  icon: string
  title: string
  description: string
}

export function CategoryCard({ icon, title, description }: CategoryCardProps) {
  return (
    <article className="category-card">
      <div className="category-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
