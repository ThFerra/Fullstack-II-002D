import { Button } from '../components/atoms/Button'

type ProductLike = {
  id: number
  nombre: string
  categoria: string
  precio: number
  stock: number
  img: string
  descripcion: string
}

type CatalogPageProps = {
  products: ProductLike[]
  cart: ProductLike[]
  onOpenDetail: (productId: number) => void
  onAddToCart: (product: ProductLike) => void
  onRemoveFromCart: (index: number) => void
  onClearCart: () => void
  cartTotal: number
}

const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')}`

export function CatalogPage({
  products,
  cart,
  onOpenDetail,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  cartTotal,
}: CatalogPageProps) {
  return (
    <section className="catalog-layout section-block row g-4">
      <div className="catalog-main col-lg-9">
        <div className="section-heading">
          <p className="eyebrow">Catálogo</p>
          <h2>Stock en tiempo real</h2>
        </div>
        <div className="product-grid row g-4">
          {products.map((product) => (
            <article className="col-12 col-md-6 col-lg-4" key={product.id}>
              <div className="product-card card h-100">
                <div className="product-tag">{product.categoria}</div>
                <img className="card-img-top" src={product.img} alt={product.nombre} />
                <div className="card-body d-flex flex-column">
                  <h3 className="card-title">{product.nombre}</h3>
                  <p className="product-stock">Stock disponible: {product.stock}</p>
                  <div className="product-meta mt-auto">
                    <span>{formatPrice(product.precio)}</span>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button variant="secondary" onClick={() => onOpenDetail(product.id)}>
                        Ver detalle
                      </Button>
                      <Button onClick={() => onAddToCart(product)}>
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="cart-panel card col-lg-3">
        <h3>Mi selección / pedido</h3>
        <ul className="cart-list">
          {cart.length === 0 ? <li className="empty-state">Tu selección está vacía.</li> : cart.map((item, index) => (
            <li key={`${item.id}-${index}`}>
              <span>{item.nombre}</span>
              <div>
                <strong>{formatPrice(item.precio)}</strong>
                <button type="button" onClick={() => onRemoveFromCart(index)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <strong>Total:</strong>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <Button variant="secondary" className="full-width" onClick={onClearCart}>Vaciar carrito</Button>
      </aside>
    </section>
  )
}
