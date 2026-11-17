type ProductCardProps = {
  name: string
  price: string
  tag: string
}

export function ProductCard({ name, price, tag }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-tag">{tag}</div>
      <div className="product-image" aria-hidden="true">
        🔨
      </div>
      <h3>{name}</h3>
      <div className="product-meta">
        <span>{price}</span>
        <button type="button">Agregar</button>
      </div>
    </article>
  )
}
