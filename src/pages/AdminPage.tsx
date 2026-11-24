// Panel administrador. Solo se muestra a usuarios con rol ADMIN (lo controla App.tsx).
// Todas las acciones llaman a la API con el token del administrador.

type ProductAdmin = {
  id: number
  nombre: string
  categoria: string
  categoriaId: number
  precio: number
  stock: number
  img: string
  descripcion: string
}

type UserAdmin = {
  id: number
  run: string
  nombre: string
  apellidos: string | null
  correo: string
  tipo: string
}

type AdminProductForm = {
  nombre: string
  precio: string
  stock: string
  categoriaId: string
  img: string
}

type AdminUserForm = {
  run: string
  nombre: string
  correo: string
  tipo: string
  password: string
  rol: string
}

type AdminPageProps = {
  adminCorreo: string
  adminMessage: string
  adminProductForm: AdminProductForm
  productEditingId: number | null
  categorias: Array<{ id: number; nombre: string }>
  adminUserForm: AdminUserForm
  userEditingId: number | null
  products: ProductAdmin[]
  users: UserAdmin[]
  onLogoutAdmin: () => void
  onUpdateProductField: (field: keyof AdminProductForm, value: string) => void
  onCreateOrUpdateProduct: (event: React.FormEvent<HTMLFormElement>) => void
  onEditProduct: (product: ProductAdmin) => void
  onDeleteProduct: (product: ProductAdmin) => void
  onCancelProductEdit: () => void
  onUpdateUserField: (field: keyof AdminUserForm, value: string) => void
  onCreateOrUpdateUser: (event: React.FormEvent<HTMLFormElement>) => void
  onEditUser: (user: UserAdmin) => void
  onDeleteUser: (user: UserAdmin) => void
  onCancelUserEdit: () => void
}

const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')}`

export function AdminPage({
  adminCorreo,
  adminMessage,
  adminProductForm,
  productEditingId,
  categorias,
  adminUserForm,
  userEditingId,
  products,
  users,
  onLogoutAdmin,
  onUpdateProductField,
  onCreateOrUpdateProduct,
  onEditProduct,
  onDeleteProduct,
  onCancelProductEdit,
  onUpdateUserField,
  onCreateOrUpdateUser,
  onEditUser,
  onDeleteUser,
  onCancelUserEdit,
}: AdminPageProps) {
  return (
    <section className="section-block admin-layout">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <h2>Panel administrador</h2>
            <small>Sesión: {adminCorreo}</small>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onLogoutAdmin}>Cerrar sesión</button>
        </div>

        {adminMessage && <p className="form-message" role="status">{adminMessage}</p>}

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
                <input type="number" min="0" value={adminProductForm.precio} onChange={(e) => onUpdateProductField('precio', e.target.value)} />
              </label>
              <label>
                Stock
                <input type="number" min="0" value={adminProductForm.stock} onChange={(e) => onUpdateProductField('stock', e.target.value)} />
              </label>
              <label>
                Categoría
                <select value={adminProductForm.categoriaId} onChange={(e) => onUpdateProductField('categoriaId', e.target.value)}>
                  <option value="">Seleccione</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={String(categoria.id)}>{categoria.nombre}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="btn btn-primary">
                {productEditingId ? 'Actualizar producto' : 'Guardar producto'}
              </button>
              {productEditingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={onCancelProductEdit}>Cancelar edición</button>
              )}
            </form>
            <div className="admin-list">
              {products.map((product) => (
                <div key={product.id} className="admin-row">
                  <div>
                    <strong>{product.nombre}</strong>
                    <span>{product.categoria} · {formatPrice(product.precio)} · Stock: {product.stock}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => onEditProduct(product)}>Editar</button>
                    <button type="button" className="btn btn-outline-danger" aria-label={`Eliminar ${product.nombre}`} onClick={() => onDeleteProduct(product)}>Eliminar</button>
                  </div>
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
                Tipo
                <select value={adminUserForm.tipo} onChange={(e) => onUpdateUserField('tipo', e.target.value)}>
                  <option value="Contratista">Contratista</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Cliente">Cliente</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </label>
              {!userEditingId && (
                <>
                  <label>
                    Contraseña
                    <input type="password" value={adminUserForm.password} onChange={(e) => onUpdateUserField('password', e.target.value)} />
                  </label>
                  <label>
                    Rol de acceso
                    <select value={adminUserForm.rol} onChange={(e) => onUpdateUserField('rol', e.target.value)}>
                      <option value="CLIENTE">CLIENTE</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </label>
                </>
              )}
              <button type="submit" className="btn btn-primary">
                {userEditingId ? 'Actualizar usuario' : 'Crear usuario'}
              </button>
              {userEditingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={onCancelUserEdit}>Cancelar edición</button>
              )}
            </form>
            <div className="admin-table">
              {users.map((user) => (
                <div key={user.id} className="admin-row">
                  <div>
                    <strong>{[user.nombre, user.apellidos].filter(Boolean).join(' ')}</strong>
                    <span>{user.correo} · {user.tipo}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => onEditUser(user)}>Editar</button>
                    {user.correo !== adminCorreo && (
                      <button type="button" className="btn btn-outline-danger" aria-label={`Eliminar ${user.correo}`} onClick={() => onDeleteUser(user)}>Eliminar</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
