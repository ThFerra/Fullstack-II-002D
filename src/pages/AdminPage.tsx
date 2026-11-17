type ProductAdmin = {
  id: number
  nombre: string
  categoria: string
  precio: number
  stock: number
  img: string
  descripcion: string
}

type UserAdmin = {
  id: number
  run: string
  nombre: string
  correo: string
  rol: string
}

type AdminProductForm = {
  nombre: string
  precio: string
  stock: string
  categoria: string
  img: string
}

type AdminUserForm = {
  run: string
  nombre: string
  correo: string
  rol: string
}

type AdminPageProps = {
  adminSession: boolean
  adminMessage: string
  adminLoginForm: { correo: string; password: string }
  adminProductForm: AdminProductForm
  productEditingId: number | null
  adminUserForm: AdminUserForm
  userEditingId: number | null
  products: ProductAdmin[]
  users: UserAdmin[]
  onUpdateLoginField: (field: 'correo' | 'password', value: string) => void
  onAdminLogin: (event: React.FormEvent<HTMLFormElement>) => void
  onLogoutAdmin: () => void
  onUpdateProductField: (field: keyof AdminProductForm, value: string) => void
  onCreateOrUpdateProduct: (event: React.FormEvent<HTMLFormElement>) => void
  onEditProduct: (product: ProductAdmin) => void
  onUpdateUserField: (field: keyof AdminUserForm, value: string) => void
  onCreateOrUpdateUser: (event: React.FormEvent<HTMLFormElement>) => void
  onEditUser: (user: UserAdmin) => void
}

const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')}`

export function AdminPage({
  adminSession,
  adminMessage,
  adminLoginForm,
  adminProductForm,
  productEditingId,
  adminUserForm,
  userEditingId,
  products,
  users,
  onUpdateLoginField,
  onAdminLogin,
  onLogoutAdmin,
  onUpdateProductField,
  onCreateOrUpdateProduct,
  onEditProduct,
  onUpdateUserField,
  onCreateOrUpdateUser,
  onEditUser,
}: AdminPageProps) {
  if (!adminSession) {
    return (
      <section className="section-block admin-layout">
        <div className="form-card">
          <div className="section-heading">
            <p className="eyebrow">Panel admin</p>
            <h2>Acceso administrador</h2>
          </div>
          <form onSubmit={onAdminLogin} className="form-box">
            <label>
              Correo
              <input value={adminLoginForm.correo} onChange={(e) => onUpdateLoginField('correo', e.target.value)} />
            </label>
            <label>
              Contraseña
              <input type="password" value={adminLoginForm.password} onChange={(e) => onUpdateLoginField('password', e.target.value)} />
            </label>
            {adminMessage && <p className="form-message">{adminMessage}</p>}
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="section-block admin-layout">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Panel administrador</h2>
          <button type="button" className="btn btn-secondary" onClick={onLogoutAdmin}>Cerrar sesión</button>
        </div>

        <div className="admin-sections">
          <div className="admin-card">
            <h3>Gestión de productos</h3>
            <form onSubmit={onCreateOrUpdateProduct} className="form-box compact-form">
              <label>
                Nombre
                <input value={adminProductForm.nombre} onChange={(e) => onUpdateProductField('nombre', e.target.value)} />
              </label>
              <label>
                Precio
                <input type="number" value={adminProductForm.precio} onChange={(e) => onUpdateProductField('precio', e.target.value)} />
              </label>
              <label>
                Stock
                <input type="number" value={adminProductForm.stock} onChange={(e) => onUpdateProductField('stock', e.target.value)} />
              </label>
              <label>
                Categoría
                <input value={adminProductForm.categoria} onChange={(e) => onUpdateProductField('categoria', e.target.value)} />
              </label>
              <button type="submit" className="btn btn-primary">
                {productEditingId ? 'Actualizar producto' : 'Guardar producto'}
              </button>
            </form>
            <div className="admin-list">
              {products.map((product) => (
                <div key={product.id} className="admin-row">
                  <div>
                    <strong>{product.nombre}</strong>
                    <span>{product.categoria} · {formatPrice(product.precio)} · Stock: {product.stock}</span>
                  </div>
                  <button type="button" className="btn btn-secondary" onClick={() => onEditProduct(product)}>Editar</button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h3>Gestión de usuarios</h3>
            <form onSubmit={onCreateOrUpdateUser} className="form-box compact-form">
              <label>
                RUN
                <input value={adminUserForm.run} onChange={(e) => onUpdateUserField('run', e.target.value)} />
              </label>
              <label>
                Nombre
                <input value={adminUserForm.nombre} onChange={(e) => onUpdateUserField('nombre', e.target.value)} />
              </label>
              <label>
                Correo
                <input value={adminUserForm.correo} onChange={(e) => onUpdateUserField('correo', e.target.value)} />
              </label>
              <label>
                Rol
                <select value={adminUserForm.rol} onChange={(e) => onUpdateUserField('rol', e.target.value)}>
                  <option value="Contratista">Contratista</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </label>
              <button type="submit" className="btn btn-primary">
                {userEditingId ? 'Actualizar usuario' : 'Crear usuario'}
              </button>
            </form>
            <div className="admin-table">
              {users.map((user) => (
                <div key={user.id} className="admin-row">
                  <div>
                    <strong>{user.nombre}</strong>
                    <span>{user.correo} · {user.rol}</span>
                  </div>
                  <button type="button" className="btn btn-secondary" onClick={() => onEditUser(user)}>Editar</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
