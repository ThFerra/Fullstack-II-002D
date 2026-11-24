import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import './App.css'
import './legacy-theme.css'
import { MainNavigation } from './components/organisms/MainNavigation'
import { AccesoRestringido } from './components/organisms/AccesoRestringido'
import { SiteTemplate } from './components/templates/SiteTemplate'
import { regionesChile } from './credentials'
import { validarEmail, validarRun } from './validations'
import { formatPrice, localImages, type NewsItem, type Product } from './items'
import { sesionStore } from './api/session'
import { aSesion, mensajeDeError } from './api/http'
import {
  authApi,
  carritoApi,
  contactoApi,
  contenidoApi,
  inventarioApi,
  productosApi,
  usuariosApi,
  type CarritoApi,
  type CategoriaApi,
  type RegionApi,
  type UsuarioApi,
} from './api/services'
import {
  AboutPage,
  AdminPage,
  CatalogPage,
  ContactPage,
  HomePage,
  LoginPage,
  NewsPage,
  ProfilePage,
  RegisterPage,
} from './pages'

type View =
  | 'home'
  | 'catalogo'
  | 'nosotros'
  | 'novedades'
  | 'contacto'
  | 'login'
  | 'registro'
  | 'perfil'
  | 'admin'

/** Producto del catálogo + el id de su categoría (lo necesita el formulario de administración). */
type ProductoVista = Product & { categoriaId: number }

const registrarActividad = (descripcion: string) => {
  const actividad = JSON.parse(localStorage.getItem('actividad_maestros') || '[]') as Array<{ descripcion: string; fecha: string }>
  actividad.unshift({ descripcion, fecha: new Date().toLocaleString('es-CL') })
  localStorage.setItem('actividad_maestros', JSON.stringify(actividad.slice(0, 30)))
}

const formularioRegistroVacio = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  telefono: '',
  tipo: '',
  region: '',
  comuna: '',
  direccion: '',
  password: '',
  confirmarPassword: '',
}

/** Catálogo: productos (productos-service) + stock (inventario-service). */
async function obtenerCatalogo(): Promise<ProductoVista[]> {
  const [productos, stock] = await Promise.all([
    productosApi.listar(),
    inventarioApi.listar().catch(() => []),
  ])
  const stockPorProducto = new Map(stock.map((s) => [s.productoId, s.cantidad]))
  return productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    categoriaId: p.categoriaId,
    precio: p.precio,
    stock: stockPorProducto.get(p.id) ?? 0,
    img: p.imagen || localImages.pintura,
    descripcion: p.descripcion ?? '',
  }))
}

const aFormularioPerfil = (perfil: UsuarioApi) => ({
  nombre: perfil.nombre,
  apellidos: perfil.apellidos ?? '',
  correo: perfil.correo,
  telefono: perfil.telefono ?? '',
  region: perfil.region ?? '',
  comuna: perfil.comuna ?? '',
  direccion: perfil.direccion ?? '',
})

const formularioProductoVacio = { nombre: '', precio: '', stock: '', categoriaId: '', img: localImages.pintura }
const formularioUsuarioVacio = { run: '', nombre: '', correo: '', tipo: 'Contratista', password: '', rol: 'CLIENTE' }

function App() {
  // ---------- Sesión (se mantiene al recargar la página) ----------
  const sesion = useSyncExternalStore(sesionStore.suscribir, sesionStore.obtener)
  const esAdmin = sesion?.rol === 'ADMIN'

  const [activeView, setActiveView] = useState<View>('home')
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  // ---------- Datos que vienen del backend ----------
  const [products, setProducts] = useState<ProductoVista[]>([])
  const [catalogStatus, setCatalogStatus] = useState<'cargando' | 'listo' | 'error'>('cargando')
  const [catalogError, setCatalogError] = useState('')
  const [categorias, setCategorias] = useState<CategoriaApi[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsError, setNewsError] = useState('')
  const [regiones, setRegiones] = useState<RegionApi[]>(regionesChile)
  const [perfil, setPerfil] = useState<UsuarioApi | null>(null)
  const [cart, setCart] = useState<CarritoApi | null>(null)
  const [cartMessage, setCartMessage] = useState('')
  const [users, setUsers] = useState<UsuarioApi[]>([])

  // ---------- Formularios ----------
  const [loginForm, setLoginForm] = useState({ correo: '', password: '' })
  const [loginMessage, setLoginMessage] = useState('')
  const [contactForm, setContactForm] = useState({ nombre: '', correo: '', mensaje: '' })
  const [contactMessage, setContactMessage] = useState('')
  const [registerForm, setRegisterForm] = useState(formularioRegistroVacio)
  const [registerMessage, setRegisterMessage] = useState('')
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
  })
  const [profileMessage, setProfileMessage] = useState('')
  const [adminMessage, setAdminMessage] = useState('')
  const [adminProductForm, setAdminProductForm] = useState(formularioProductoVacio)
  const [productEditingId, setProductEditingId] = useState<number | null>(null)
  const [adminUserForm, setAdminUserForm] = useState(formularioUsuarioVacio)
  const [userEditingId, setUserEditingId] = useState<number | null>(null)

  // ---------- Carga de datos ----------

  const mostrarCatalogo = (lista: ProductoVista[]) => {
    setProducts(lista)
    setCatalogStatus('listo')
  }

  const mostrarErrorCatalogo = (error: unknown) => {
    setCatalogError(`No se pudo cargar el catálogo. ${mensajeDeError(error)}`)
    setCatalogStatus('error')
  }

  /** Vuelve a pedir el catálogo (después de crear, editar o eliminar productos). */
  const cargarCatalogo = () => obtenerCatalogo().then(mostrarCatalogo, mostrarErrorCatalogo)

  useEffect(() => {
    obtenerCatalogo()
      .then((lista) => {
        setProducts(lista)
        setCatalogStatus('listo')
      })
      .catch((error) => {
        setCatalogError(`No se pudo cargar el catálogo. ${mensajeDeError(error)}`)
        setCatalogStatus('error')
      })

    contenidoApi.noticias()
      .then((noticias) => setNews(noticias.map((n) => ({
        title: n.titulo,
        image: n.imagen ?? '',
        imageAlt: n.imagenAlt ?? n.titulo,
        summary: n.resumen,
        detail: n.detalle,
      }))))
      .catch((error) => setNewsError(`No se pudieron cargar las novedades. ${mensajeDeError(error)}`))

    usuariosApi.regiones().then(setRegiones).catch(() => {
      // Sin conexión se usan las regiones locales para no bloquear el formulario.
    })
  }, [])

  // Cada vez que cambia la sesión (login, recarga de página o cierre) se cargan los datos del usuario.
  const correoSesion = sesion?.correo
  useEffect(() => {
    if (!correoSesion) return
    usuariosApi.miPerfil()
      .then((datos) => {
        setPerfil(datos)
        setProfileForm(aFormularioPerfil(datos))
      })
      .catch(() => setPerfil(null))
    carritoApi.ver().then(setCart).catch(() => setCart(null))
  }, [correoSesion])

  // Solo se muestran los datos que pertenecen a la sesión actual (evita ver datos de otra cuenta).
  const perfilActual = sesion && perfil?.correo === sesion.correo ? perfil : null
  const carritoActual = sesion && cart?.usuario === sesion.correo ? cart : null

  const cargarDatosAdmin = useCallback(async () => {
    try {
      const [listaUsuarios, listaCategorias] = await Promise.all([usuariosApi.listar(), productosApi.categorias()])
      setUsers(listaUsuarios)
      setCategorias(listaCategorias)
    } catch (error) {
      setAdminMessage(mensajeDeError(error))
    }
  }, [])

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null

  const openView = (view: View, productId?: number) => {
    setActiveView(view)
    setSelectedProductId(productId ?? null)
  }

  const abrirPanelAdmin = () => {
    openView('admin')
    void cargarDatosAdmin()
  }

  // ---------- Carrito (carrito-service, requiere sesión) ----------

  const addToCart = async (product: Product) => {
    if (!sesionStore.obtener()) {
      setLoginMessage('Inicia sesión para agregar productos a tu selección.')
      openView('login')
      return
    }
    try {
      setCart(await carritoApi.agregar(product.id, 1))
      setCartMessage(`"${product.nombre}" se agregó a tu selección.`)
      registrarActividad(`Agregó "${product.nombre}" a su selección`)
    } catch (error) {
      setCartMessage(mensajeDeError(error))
    }
  }

  const removeFromCart = async (productoId: number) => {
    try {
      setCart(await carritoApi.quitar(productoId))
      setCartMessage('')
    } catch (error) {
      setCartMessage(mensajeDeError(error))
    }
  }

  const clearCart = async () => {
    try {
      setCart(await carritoApi.vaciar())
      setCartMessage('')
    } catch (error) {
      setCartMessage(mensajeDeError(error))
    }
  }

  // ---------- Inicio y cierre de sesión (auth-service) ----------

  const loginCliente = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const correo = loginForm.correo.trim().toLowerCase()
    const password = loginForm.password

    if (!validarEmail(correo) || correo.length > 100) {
      setLoginMessage('Ingresa un correo válido.')
      return
    }
    if (!password) {
      setLoginMessage('Ingresa tu contraseña.')
      return
    }

    try {
      const tokens = await authApi.login(correo, password)
      sesionStore.guardar(aSesion(tokens))
      registrarActividad(tokens.rol === 'ADMIN' ? 'Inicio de sesión como administrador' : 'Inicio de sesión como cliente')
      setLoginForm({ correo: '', password: '' })
      setLoginMessage('')
      if (tokens.rol === 'ADMIN') {
        abrirPanelAdmin()
      } else {
        setActiveView('perfil')
      }
    } catch (error) {
      setLoginMessage(mensajeDeError(error))
    }
  }

  const cerrarSesion = () => {
    const actual = sesionStore.obtener()
    if (actual) {
      // Se revoca el refresh token en el servidor; si falla, igual se cierra localmente.
      authApi.logout(actual.refreshToken).catch(() => undefined)
    }
    sesionStore.limpiar()
    setProfileMessage('')
    setAdminMessage('')
    setCartMessage('')
    setActiveView('home')
  }

  // ---------- Contacto (contacto-service) ----------

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nombre = contactForm.nombre.trim()
    const correo = contactForm.correo.trim()
    const mensaje = contactForm.mensaje.trim()

    if (!nombre || nombre.length > 100) {
      setContactMessage('El nombre es obligatorio y debe tener máximo 100 caracteres.')
      return
    }
    if (!correo || correo.length > 100 || !validarEmail(correo)) {
      setContactMessage('Ingrese un correo válido de máximo 100 caracteres.')
      return
    }
    if (!mensaje || mensaje.length > 500) {
      setContactMessage('El comentario es obligatorio y debe tener máximo 500 caracteres.')
      return
    }

    try {
      const respuesta = await contactoApi.enviar({ nombre, correo, mensaje })
      registrarActividad('Envió una consulta de contacto')
      setContactMessage(respuesta.mensaje)
      setContactForm({ nombre: '', correo: '', mensaje: '' })
    } catch (error) {
      setContactMessage(mensajeDeError(error))
    }
  }

  // ---------- Registro (usuarios-service + auth-service) ----------

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const run = registerForm.run.trim().toUpperCase()
    const nombre = registerForm.nombre.trim()
    const apellidos = registerForm.apellidos.trim()
    const correo = registerForm.correo.trim().toLowerCase()

    // Validaciones en el navegador (respuesta inmediata). El backend vuelve a validar todo.
    if (!validarRun(run)) {
      setRegisterMessage('Ingrese un RUN válido, sin puntos ni guion.')
      return
    }
    if (!nombre || nombre.length > 50) {
      setRegisterMessage('El nombre es obligatorio y debe tener máximo 50 caracteres.')
      return
    }
    if (!apellidos || apellidos.length > 100) {
      setRegisterMessage('Los apellidos son obligatorios y deben tener máximo 100 caracteres.')
      return
    }
    if (!correo || correo.length > 100 || !validarEmail(correo)) {
      setRegisterMessage('Ingrese un correo válido de máximo 100 caracteres.')
      return
    }
    if (!registerForm.tipo) {
      setRegisterMessage('Seleccione un tipo de usuario.')
      return
    }
    if (!registerForm.region) {
      setRegisterMessage('Seleccione una región.')
      return
    }
    if (!registerForm.comuna) {
      setRegisterMessage('Seleccione una comuna.')
      return
    }
    if (!registerForm.direccion || registerForm.direccion.length > 300) {
      setRegisterMessage('La dirección es obligatoria y debe tener máximo 300 caracteres.')
      return
    }
    if (registerForm.telefono.replace(/\D/g, '').length < 8) {
      setRegisterMessage('Ingresa un teléfono válido para contactarte.')
      return
    }
    if (registerForm.password.length < 8 || registerForm.password.length > 64 || !/[A-Za-z]/.test(registerForm.password) || !/\d/.test(registerForm.password)) {
      setRegisterMessage('La contraseña debe tener entre 8 y 64 caracteres e incluir letras y números.')
      return
    }
    if (registerForm.password !== registerForm.confirmarPassword) {
      setRegisterMessage('Las contraseñas no coinciden.')
      return
    }

    try {
      await usuariosApi.registrar({ ...registerForm, run, nombre, apellidos, correo })
      // Con la cuenta creada, se inicia sesión automáticamente.
      const tokens = await authApi.login(correo, registerForm.password)
      sesionStore.guardar(aSesion(tokens))
      registrarActividad('Creó una cuenta de cliente')
      setRegisterMessage('')
      setRegisterForm(formularioRegistroVacio)
      setProfileMessage('Cuenta creada. ¡Te damos la bienvenida!')
      setActiveView('perfil')
    } catch (error) {
      setRegisterMessage(mensajeDeError(error))
    }
  }

  // ---------- Perfil (usuarios-service) ----------

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!perfilActual) return

    const correo = profileForm.correo.trim().toLowerCase()
    if (!profileForm.nombre.trim() || !profileForm.apellidos.trim()) {
      setProfileMessage('El nombre y los apellidos son obligatorios.')
      return
    }
    if (!validarEmail(correo) || correo.length > 100) {
      setProfileMessage('Ingresa un correo válido.')
      return
    }
    if (profileForm.telefono.replace(/\D/g, '').length < 8) {
      setProfileMessage('Ingresa un teléfono válido.')
      return
    }
    if (!profileForm.region || !profileForm.comuna || !profileForm.direccion.trim()) {
      setProfileMessage('Completa región, comuna y dirección.')
      return
    }

    try {
      const actualizado = await usuariosApi.actualizarMiPerfil({
        nombre: profileForm.nombre.trim(),
        apellidos: profileForm.apellidos.trim(),
        correo,
        telefono: profileForm.telefono.trim(),
        region: profileForm.region,
        comuna: profileForm.comuna,
        direccion: profileForm.direccion.trim(),
      })
      registrarActividad('Actualizó sus datos personales')

      if (actualizado.correo !== perfilActual.correo) {
        // El token pertenece al correo anterior: hay que iniciar sesión con el nuevo.
        sesionStore.limpiar()
        setLoginMessage('Actualizaste tu correo. Inicia sesión nuevamente con el correo nuevo.')
        setActiveView('login')
        return
      }
      setPerfil(actualizado)
      setProfileForm(aFormularioPerfil(actualizado))
      setProfileMessage('Tus datos se actualizaron correctamente.')
    } catch (error) {
      setProfileMessage(mensajeDeError(error))
    }
  }

  // ---------- Administración: productos (productos-service + inventario-service) ----------

  const createOrUpdateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nombre = adminProductForm.nombre.trim()
    const precio = Number(adminProductForm.precio)
    const stock = Number(adminProductForm.stock)
    const categoriaId = Number(adminProductForm.categoriaId)

    if (!nombre || !categoriaId || adminProductForm.precio === '' || !Number.isInteger(precio) || precio < 0
        || adminProductForm.stock === '' || !Number.isInteger(stock) || stock < 0) {
      setAdminMessage('Complete todos los campos del producto (precio y stock deben ser números enteros, sin negativos).')
      return
    }

    try {
      if (productEditingId) {
        const original = products.find((p) => p.id === productEditingId)
        await productosApi.actualizar(productEditingId, {
          nombre,
          descripcion: original?.descripcion,
          precio,
          imagen: adminProductForm.img,
          categoriaId,
        })
        await inventarioApi.fijarStock(productEditingId, stock)
        setAdminMessage('Producto actualizado.')
      } else {
        await productosApi.crear({ nombre, precio, imagen: adminProductForm.img, categoriaId, stockInicial: stock })
        setAdminMessage('Producto creado.')
      }
      setAdminProductForm(formularioProductoVacio)
      setProductEditingId(null)
      await cargarCatalogo()
    } catch (error) {
      setAdminMessage(mensajeDeError(error))
    }
  }

  const handleEditProduct = (product: ProductoVista) => {
    setProductEditingId(product.id)
    setAdminProductForm({
      nombre: product.nombre,
      precio: String(product.precio),
      stock: String(product.stock),
      categoriaId: String(product.categoriaId),
      img: product.img,
    })
  }

  const handleDeleteProduct = async (product: ProductoVista) => {
    try {
      await productosApi.eliminar(product.id)
      setAdminMessage(`Producto "${product.nombre}" eliminado.`)
      if (productEditingId === product.id) {
        setProductEditingId(null)
        setAdminProductForm(formularioProductoVacio)
      }
      await cargarCatalogo()
    } catch (error) {
      setAdminMessage(mensajeDeError(error))
    }
  }

  // ---------- Administración: usuarios (usuarios-service) ----------

  const createOrUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const run = adminUserForm.run.trim()
    const nombre = adminUserForm.nombre.trim()
    const correo = adminUserForm.correo.trim().toLowerCase()

    if (!validarRun(run) || !nombre || !validarEmail(correo) || !adminUserForm.tipo) {
      setAdminMessage('Complete correctamente los datos del usuario (RUN válido, nombre y correo).')
      return
    }

    try {
      if (userEditingId) {
        // Se mantienen los datos que el formulario no muestra (apellidos, dirección, etc.).
        const original = users.find((u) => u.id === userEditingId)
        await usuariosApi.actualizar(userEditingId, {
          run,
          nombre,
          correo,
          tipo: adminUserForm.tipo,
          apellidos: original?.apellidos,
          telefono: original?.telefono,
          region: original?.region,
          comuna: original?.comuna,
          direccion: original?.direccion,
        })
        setAdminMessage('Usuario actualizado.')
      } else {
        await usuariosApi.crear({
          run,
          nombre,
          correo,
          tipo: adminUserForm.tipo,
          password: adminUserForm.password,
          rol: adminUserForm.rol === 'ADMIN' ? 'ADMIN' : 'CLIENTE',
        })
        setAdminMessage('Usuario creado.')
      }
      setAdminUserForm(formularioUsuarioVacio)
      setUserEditingId(null)
      setUsers(await usuariosApi.listar())
    } catch (error) {
      setAdminMessage(mensajeDeError(error))
    }
  }

  const handleEditUser = (user: { id: number; run: string; nombre: string; correo: string; tipo: string }) => {
    setUserEditingId(user.id)
    setAdminUserForm({ run: user.run, nombre: user.nombre, correo: user.correo, tipo: user.tipo, password: '', rol: 'CLIENTE' })
  }

  const handleDeleteUser = async (user: { id: number; correo: string }) => {
    try {
      await usuariosApi.eliminar(user.id)
      setAdminMessage(`Usuario ${user.correo} eliminado.`)
      setUsers(await usuariosApi.listar())
    } catch (error) {
      setAdminMessage(mensajeDeError(error))
    }
  }

  // ---------- Vistas ----------

  const renderHome = () => (
    <HomePage
      onOpenCatalog={() => openView('catalogo')}
      onOpenAbout={() => openView('nosotros')}
    />
  )

  const renderNosotros = () => (
    <AboutPage
      onOpenCatalog={() => openView('catalogo')}
      onOpenContact={() => openView('contacto')}
    />
  )

  const renderCatalogo = () => (
    <CatalogPage
      products={products}
      status={catalogStatus}
      errorMessage={catalogError}
      cart={carritoActual?.items ?? []}
      cartTotal={carritoActual?.total ?? 0}
      cartMessage={cartMessage}
      isLoggedIn={Boolean(sesion)}
      onOpenDetail={(productId) => openView('catalogo', productId)}
      onAddToCart={(product) => void addToCart(product)}
      onRemoveFromCart={(productoId) => void removeFromCart(productoId)}
      onClearCart={() => void clearCart()}
      onRetry={() => {
        setCatalogStatus('cargando')
        void cargarCatalogo()
      }}
    />
  )

  const renderDetalle = () => (
    <section className="section-block detail-page">
      {selectedProduct ? (
        <div className="detail-card">
          <img src={selectedProduct.img} alt={selectedProduct.nombre} />
          <div className="detail-info">
            <span className="detail-tag">{selectedProduct.categoria}</span>
            <h2>{selectedProduct.nombre}</h2>
            <p className="detail-price">{formatPrice(selectedProduct.precio)}</p>
            <p>{selectedProduct.descripcion}</p>
            <p className="stock-line">Stock disponible: <strong>{selectedProduct.stock}</strong></p>
            {cartMessage && <p className="form-message" role="status">{cartMessage}</p>}
            <div className="detail-actions">
              <button type="button" className="btn btn-primary" onClick={() => void addToCart(selectedProduct)} disabled={selectedProduct.stock <= 0}>
                Agregar a selección
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => openView('catalogo')}>
                Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state-box">Selecciona un producto para ver su detalle.</div>
      )}
    </section>
  )

  const renderNovedades = () => (
    <>
      {newsError && <p className="section-block form-message" role="alert">{newsError}</p>}
      <NewsPage
        newsItems={news}
        selectedNews={selectedNews}
        onSelectNews={setSelectedNews}
        onCloseNews={() => setSelectedNews(null)}
      />
    </>
  )

  const renderContacto = () => (
    <ContactPage
      form={contactForm}
      message={contactMessage}
      onChange={(next) => setContactForm(next)}
      onSubmit={(event) => void handleContactSubmit(event)}
    />
  )

  const renderLogin = () => (
    <LoginPage
      correo={loginForm.correo}
      password={loginForm.password}
      message={loginMessage}
      onChange={(field, value) => setLoginForm({ ...loginForm, [field]: value })}
      onSubmit={(event) => void loginCliente(event)}
      onOpenRegister={() => openView('registro')}
    />
  )

  const renderRegistro = () => (
    <RegisterPage
      form={registerForm}
      message={registerMessage}
      regiones={regiones}
      onChange={(next) => setRegisterForm(next)}
      onSubmit={(event) => void handleRegisterSubmit(event)}
      onOpenLogin={() => openView('login')}
    />
  )

  const renderPerfil = () => (
    <ProfilePage
      activeAccount={perfilActual}
      profileForm={profileForm}
      profileMessage={profileMessage}
      regiones={regiones}
      onOpenLogin={() => openView('login')}
      onOpenRegister={() => openView('registro')}
      onLogout={cerrarSesion}
      onChange={(next) => setProfileForm(next)}
      onSubmit={(event) => void saveProfile(event)}
    />
  )

  /** Restricción por rol: el panel solo se muestra a usuarios con rol ADMIN. */
  const renderAdmin = () => {
    if (!sesion) {
      return (
        <AccesoRestringido
          titulo="Panel solo para administradores"
          mensaje="Inicia sesión con una cuenta de administrador para entrar al panel."
          textoBoton="Iniciar sesión"
          onAccion={() => openView('login')}
        />
      )
    }
    if (!esAdmin) {
      return (
        <AccesoRestringido
          titulo="Acceso denegado"
          mensaje="Tu cuenta no tiene permisos de administrador."
          textoBoton="Volver al inicio"
          onAccion={() => openView('home')}
        />
      )
    }
    return (
      <AdminPage
        adminCorreo={sesion.correo}
        adminMessage={adminMessage}
        adminProductForm={adminProductForm}
        productEditingId={productEditingId}
        categorias={categorias}
        adminUserForm={adminUserForm}
        userEditingId={userEditingId}
        products={products}
        users={users}
        onLogoutAdmin={cerrarSesion}
        onUpdateProductField={(field, value) => setAdminProductForm({ ...adminProductForm, [field]: value })}
        onCreateOrUpdateProduct={(event) => void createOrUpdateProduct(event)}
        onEditProduct={handleEditProduct}
        onDeleteProduct={(product) => void handleDeleteProduct(product)}
        onCancelProductEdit={() => {
          setProductEditingId(null)
          setAdminProductForm(formularioProductoVacio)
        }}
        onUpdateUserField={(field, value) => setAdminUserForm({ ...adminUserForm, [field]: value })}
        onCreateOrUpdateUser={(event) => void createOrUpdateUser(event)}
        onEditUser={handleEditUser}
        onDeleteUser={(user) => void handleDeleteUser(user)}
        onCancelUserEdit={() => {
          setUserEditingId(null)
          setAdminUserForm(formularioUsuarioVacio)
        }}
      />
    )
  }

  // El menú cambia según la sesión y el rol: cada usuario solo ve lo que puede usar.
  const navItems = [
    { label: 'Inicio', onClick: () => openView('home') },
    { label: 'Nosotros', onClick: () => openView('nosotros') },
    { label: 'Novedades', onClick: () => openView('novedades') },
    { label: 'Catálogo', onClick: () => openView('catalogo') },
    { label: 'Contacto', onClick: () => openView('contacto') },
    ...(sesion
      ? [
          { label: 'Mi perfil', onClick: () => openView('perfil') },
          ...(esAdmin ? [{ label: 'Panel Admin', onClick: abrirPanelAdmin }] : []),
          { label: 'Cerrar sesión', onClick: cerrarSesion },
        ]
      : [
          { label: 'Iniciar sesión', onClick: () => openView('login') },
          { label: 'Registrarse', onClick: () => openView('registro') },
        ]),
  ]

  const header = (
    <header className="site-header navbar navbar-expand-xl">
      <div className="brand navbar-brand">
        <div className="brand-symbol">
          <img src={localImages.logo} alt="Ferretería Los Maestros logo" className="brand-logo" />
        </div>
        <div>
          <strong>Ferretería Los Maestros</strong>
          <small>Materiales y herramientas</small>
          {sesion && (
            <small className="session-badge" data-testid="sesion-actual">
              {sesion.correo} · {sesion.rol}
            </small>
          )}
        </div>
      </div>
      <MainNavigation items={navItems} />
    </header>
  )

  return (
    <SiteTemplate header={header}>
      {activeView === 'home' && renderHome()}
      {activeView === 'catalogo' && (selectedProduct ? renderDetalle() : renderCatalogo())}
      {activeView === 'nosotros' && renderNosotros()}
      {activeView === 'novedades' && renderNovedades()}
      {activeView === 'contacto' && renderContacto()}
      {activeView === 'login' && renderLogin()}
      {activeView === 'registro' && renderRegistro()}
      {activeView === 'perfil' && renderPerfil()}
      {activeView === 'admin' && renderAdmin()}
    </SiteTemplate>
  )
}

export default App
