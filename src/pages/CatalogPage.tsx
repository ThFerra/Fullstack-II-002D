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

/** Producto dentro del carrito, tal como lo devuelve carrito-service. */
type CartItem = {
  productoId: number
  nombre: string
  precioUnitario: number
  cantidad: number
  subtotal: number
}

type CatalogPageProps = {
  products: ProductLike[]
  status: 'cargando' | 'listo' | 'error'
  errorMessage: string
  cart: CartItem[]
  cartTotal: number
  cartMessage: string
  isLoggedIn: boolean
  onOpenDetail: (productId: number) => void
  onAddToCart: (product: ProductLike) => void
  onRemoveFromCart: (productoId: number) => void
  onClearCart: () => void
  onRetry: () => void
}

const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')}`

export function CatalogPage({
  products,
  status,
  errorMessage,
  cart,
  cartTotal,
  cartMessage,
  isLoggedIn,
  onOpenDetail,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onRetry,
}: CatalogPageProps) {
  return (
    <section className="catalog-layout section-block row g-4">
      <div className="catalog-main col-lg-9">
        <div className="section-heading">
          <p className="eyebrow">Catálogo</p>
          <h2>Stock en tiempo real</h2>
        </div>

        {status === 'cargando' && <p className="empty-state-box" role="status">Cargando productos...</p>}

        {status === 'error' && (
          <div className="empty-state-box api-error" role="alert">
            <p>{errorMessage}</p>
            <Button variant="secondary" onClick={onRetry}>Reintentar</Button>
          </div>
        )}

        {status === 'listo' && (
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
                        <Button onClick={() => onAddToCart(product)} disabled={product.stock <= 0}>
                          {product.stock <= 0 ? 'Sin stock' : 'Agregar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="cart-panel card col-lg-3">
        <h3>Mi selección / pedido</h3>
        {cartMessage && <p className="form-message cart-message" role="status">{cartMessage}</p>}
        {!isLoggedIn ? (
          <p className="empty-state">Inicia sesión para guardar productos en tu selección.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.length === 0 ? <li className="empty-state">Tu selección está vacía.</li> : cart.map((item) => (
                <li key={item.productoId}>
                  <span>{item.nombre}{item.cantidad > 1 ? ` x${item.cantidad}` : ''}</span>
                  <div>
                    <strong>{formatPrice(item.subtotal)}</strong>
                    <button type="button" aria-label={`Quitar ${item.nombre}`} onClick={() => onRemoveFromCart(item.productoId)}>❌</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>Total:</strong>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <Button variant="secondary" className="full-width" onClick={onClearCart}>Vaciar carrito</Button>
          </>
        )}
      </aside>
    </section>
  )
}
