import { useEffect, useState } from 'react'
import './App.css'
import './legacy-theme.css'
import { MainNavigation } from './components/organisms/MainNavigation'
import { SiteTemplate } from './components/templates/SiteTemplate'
import {
  createPasswordHash,
  defaultUsers,
  demoCustomerAccount,
  type CustomerAccount,
  type UserRecord,
  regionesChile,
} from './credentials'
import { validarEmail, validarRun } from './validations'
import {
  formatPrice,
  initialProducts,
  localImages,
  newsItems,
  type NewsItem,
  type Product,
} from './items'
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

const registrarActividad = (descripcion: string) => {
  const actividad = JSON.parse(localStorage.getItem('actividad_maestros') || '[]') as Array<{ descripcion: string; fecha: string }>
  actividad.unshift({ descripcion, fecha: new Date().toLocaleString('es-CL') })
  localStorage.setItem('actividad_maestros', JSON.stringify(actividad.slice(0, 30)))
}

function App() {
  const [activeView, setActiveView] = useState<View>('home')
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('productos_maestros')
    if (!saved) return initialProducts

    const storedProducts = JSON.parse(saved) as Product[]
    return storedProducts.map((product) => {
      const originalProduct = initialProducts.find((initialProduct) => initialProduct.id === product.id)
      return originalProduct ? { ...product, img: originalProduct.img } : product
    })
  })
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem('carrito_maestros')
    return saved ? JSON.parse(saved) : []
  })
  const [users, setUsers] = useState<UserRecord[]>(() => {
    const saved = localStorage.getItem('usuarios_maestros')
    return saved ? JSON.parse(saved) : defaultUsers
  })
  const [accounts, setAccounts] = useState<CustomerAccount[]>(() => {
    const saved = localStorage.getItem('cuentas_maestros')
    return saved ? JSON.parse(saved) : []
  })
  const [activeAccount, setActiveAccount] = useState<CustomerAccount | null>(() => {
    const correo = sessionStorage.getItem('los_maestros_user_email')
    if (!correo) return null
    if (correo.toLowerCase() === demoCustomerAccount.correo) return demoCustomerAccount
    const saved = JSON.parse(localStorage.getItem('cuentas_maestros') || '[]') as CustomerAccount[]
    return saved.find((account) => account.correo.toLowerCase() === correo.toLowerCase()) ?? null
  })
  const [adminSession, setAdminSession] = useState(false)
  const [loginForm, setLoginForm] = useState({ correo: '', password: '' })
  const [loginMessage, setLoginMessage] = useState('')
  const [contactForm, setContactForm] = useState({ nombre: '', correo: '', mensaje: '' })
  const [contactMessage, setContactMessage] = useState('')
  const [registerForm, setRegisterForm] = useState({
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
  })
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
  const [adminLoginForm, setAdminLoginForm] = useState({ correo: '', password: '' })
  const [adminMessage, setAdminMessage] = useState('')
  const [adminProductForm, setAdminProductForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    img: localImages.pintura,
  })
  const [productEditingId, setProductEditingId] = useState<number | null>(null)
  const [adminUserForm, setAdminUserForm] = useState({
    run: '',
    nombre: '',
    correo: '',
    rol: 'Contratista',
  })
  const [userEditingId, setUserEditingId] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem('productos_maestros', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('carrito_maestros', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('usuarios_maestros', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('cuentas_maestros', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    if (!activeAccount) return
    setProfileForm({
      nombre: activeAccount.nombre,
      apellidos: activeAccount.apellidos,
      correo: activeAccount.correo,
      telefono: activeAccount.telefono,
      region: activeAccount.region,
      comuna: activeAccount.comuna,
      direccion: activeAccount.direccion,
    })
  }, [activeAccount])

  useEffect(() => {
    setAdminSession(sessionStorage.getItem('los_maestros_admin_session') === 'active')
  }, [])

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null
  const cartTotal = cart.reduce((sum, item) => sum + item.precio, 0)

  const openView = (view: View, productId?: number) => {
    setActiveView(view)
    if (productId !== undefined) {
      setSelectedProductId(productId)
    } else {
      setSelectedProductId(null)
    }
  }

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product])
    registrarActividad(`Agregó "${product.nombre}" a su selección`)
  }

  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const product = prev[index]
      if (product) registrarActividad(`Quitó "${product.nombre}" de su selección`)
      return prev.filter((_, idx) => idx !== index)
    })
  }

  const loginCliente = (event: React.FormEvent<HTMLFormElement>) => {
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

    const account = accounts.find((item) => item.correo.toLowerCase() === correo)
    const isDemoLogin = correo === demoCustomerAccount.correo && password === 'Cliente123'

    void (async () => {
      const passwordMatches = account
        ? await createPasswordHash(password, account.passwordSalt).then(({ passwordHash }) => passwordHash === account.passwordHash)
        : false

      if (!passwordMatches && !isDemoLogin) {
        setLoginMessage('El correo o la contraseña no coinciden con una cuenta registrada.')
        return
      }

      const signedInAccount = account ?? demoCustomerAccount
      if (!account && isDemoLogin) {
        setAccounts((previous) => [...previous, demoCustomerAccount])
      }
      setActiveAccount(signedInAccount)
      sessionStorage.setItem('los_maestros_user_session', 'active')
      sessionStorage.setItem('los_maestros_user_email', signedInAccount.correo)
      registrarActividad('Inicio de sesión como cliente')
      setLoginMessage('¡Inicio de sesión exitoso!')
      setActiveView('perfil')
    })()
  }

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    registrarActividad('Envió una consulta de contacto')
    setContactMessage('Consulta enviada correctamente.')
    setContactForm({ nombre: '', correo: '', mensaje: '' })
  }

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const run = registerForm.run.trim().toUpperCase()
    const nombre = registerForm.nombre.trim()
    const apellidos = registerForm.apellidos.trim()
    const correo = registerForm.correo.trim().toLowerCase()

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
    if (correo === demoCustomerAccount.correo || accounts.some((account) => account.correo.toLowerCase() === correo)) {
      setRegisterMessage('Ya existe una cuenta con ese correo. Inicia sesión o utiliza otro correo.')
      return
    }
    if (accounts.some((account) => account.run === run)) {
      setRegisterMessage('Ya existe una cuenta con ese RUN.')
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

    const passwordCredentials = await createPasswordHash(registerForm.password)
    const newAccount: CustomerAccount = {
      id: Date.now(),
      run,
      nombre,
      apellidos,
      correo,
      telefono: registerForm.telefono.trim(),
      tipo: registerForm.tipo,
      region: registerForm.region,
      comuna: registerForm.comuna,
      direccion: registerForm.direccion.trim(),
      ...passwordCredentials,
    }

    const newUser: UserRecord = {
      id: newAccount.id,
      run,
      nombre: `${nombre} ${apellidos}`,
      correo,
      rol: registerForm.tipo,
    }

    setAccounts((previous) => [...previous, newAccount])
    setUsers((prev) => [...prev, newUser])
    setActiveAccount(newAccount)
    sessionStorage.setItem('los_maestros_user_session', 'active')
    sessionStorage.setItem('los_maestros_user_email', newAccount.correo)
    registrarActividad('Creó una cuenta de cliente')
    setRegisterMessage('Cuenta creada. ¡Te damos la bienvenida!')
    setRegisterForm({
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
    })
    setActiveView('perfil')
  }

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeAccount) return

    const correo = profileForm.correo.trim().toLowerCase()
    if (!profileForm.nombre.trim() || !profileForm.apellidos.trim()) {
      setProfileMessage('El nombre y los apellidos son obligatorios.')
      return
    }
    if (!validarEmail(correo) || correo.length > 100) {
      setProfileMessage('Ingresa un correo válido.')
      return
    }
    if (accounts.some((account) => account.id !== activeAccount.id && account.correo.toLowerCase() === correo)) {
      setProfileMessage('Ese correo ya está asociado a otra cuenta.')
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

    const updatedAccount = {
      ...activeAccount,
      nombre: profileForm.nombre.trim(),
      apellidos: profileForm.apellidos.trim(),
      correo,
      telefono: profileForm.telefono.trim(),
      region: profileForm.region,
      comuna: profileForm.comuna,
      direccion: profileForm.direccion.trim(),
    }
    setAccounts((previous) => previous.map((account) => account.id === activeAccount.id ? updatedAccount : account))
    setUsers((previous) => previous.map((user) => user.id === activeAccount.id
      ? { ...user, nombre: `${updatedAccount.nombre} ${updatedAccount.apellidos}`, correo }
      : user))
    setActiveAccount(updatedAccount)
    sessionStorage.setItem('los_maestros_user_email', correo)
    setProfileMessage('Tus datos se actualizaron correctamente.')
    registrarActividad('Actualizó sus datos personales')
  }

  const logoutCliente = () => {
    sessionStorage.removeItem('los_maestros_user_session')
    sessionStorage.removeItem('los_maestros_user_email')
    setActiveAccount(null)
    setProfileMessage('')
    setActiveView('home')
  }

  const adminLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = adminLoginForm.correo.trim().toLowerCase()
    const password = adminLoginForm.password

    if (email !== 'admin@losmaestros.cl') {
      setAdminMessage('El correo no corresponde a un administrador.')
      return
    }
    if (password !== 'Admin123') {
      setAdminMessage('La contraseña de administrador no es correcta.')
      return
    }

    sessionStorage.setItem('los_maestros_admin_session', 'active')
    setAdminSession(true)
    setAdminMessage('Acceso autorizado.')
  }

  const logoutAdmin = () => {
    sessionStorage.removeItem('los_maestros_admin_session')
    setAdminSession(false)
    setAdminLoginForm({ correo: '', password: '' })
    setAdminMessage('')
  }

  const createOrUpdateProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = adminProductForm.nombre.trim()
    const precio = Number(adminProductForm.precio)
    const stock = Number(adminProductForm.stock)

    if (!trimmedName || !adminProductForm.categoria || !Number.isFinite(precio) || stock < 0) {
      setAdminMessage('Complete todos los campos del producto.')
      return
    }

    if (productEditingId) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === productEditingId
            ? { ...item, nombre: trimmedName, precio, stock, categoria: adminProductForm.categoria, img: adminProductForm.img }
            : item,
        ),
      )
      setAdminMessage('Producto actualizado.')
    } else {
      const newProduct: Product = {
        id: Date.now(),
        nombre: trimmedName,
        categoria: adminProductForm.categoria,
        precio,
        stock,
        img: adminProductForm.img || localImages.pintura,
        descripcion: 'Producto agregado desde el panel administrativo.',
      }
      setProducts((prev) => [newProduct, ...prev])
      setAdminMessage('Producto creado.')
    }

    setAdminProductForm({ nombre: '', precio: '', stock: '', categoria: '', img: localImages.pintura })
    setProductEditingId(null)
  }

  const handleEditProduct = (product: Product) => {
    setProductEditingId(product.id)
    setAdminProductForm({
      nombre: product.nombre,
      precio: String(product.precio),
      stock: String(product.stock),
      categoria: product.categoria,
      img: product.img,
    })
  }

  const createOrUpdateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!adminUserForm.run || !adminUserForm.nombre || !validarEmail(adminUserForm.correo) || !adminUserForm.rol) {
      setAdminMessage('Complete correctamente los datos del usuario.')
      return
    }

    if (userEditingId) {
      setUsers((prev) => prev.map((item) => (item.id === userEditingId ? { ...item, ...adminUserForm } : item)))
      setAdminMessage('Usuario actualizado.')
    } else {
      setUsers((prev) => [{ id: Date.now(), ...adminUserForm }, ...prev])
      setAdminMessage('Usuario creado.')
    }

    setAdminUserForm({ run: '', nombre: '', correo: '', rol: 'Contratista' })
    setUserEditingId(null)
  }

  const handleEditUser = (user: UserRecord) => {
    setUserEditingId(user.id)
    setAdminUserForm({
      run: user.run,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    })
  }

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
      cart={cart}
      onOpenDetail={(productId) => openView('catalogo', productId)}
      onAddToCart={addToCart}
      onRemoveFromCart={removeFromCart}
      onClearCart={() => setCart([])}
      cartTotal={cartTotal}
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
            <div className="detail-actions">
              <button type="button" className="btn btn-primary" onClick={() => addToCart(selectedProduct)}>
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
    <NewsPage
      newsItems={newsItems}
      selectedNews={selectedNews}
      onSelectNews={setSelectedNews}
      onCloseNews={() => setSelectedNews(null)}
    />
  )

  const renderContacto = () => (
    <ContactPage
      form={contactForm}
      message={contactMessage}
      onChange={(next) => setContactForm(next)}
      onSubmit={handleContactSubmit}
    />
  )

  const renderLogin = () => (
    <LoginPage
      correo={loginForm.correo}
      password={loginForm.password}
      message={loginMessage}
      onChange={(field, value) => setLoginForm({ ...loginForm, [field]: value })}
      onSubmit={loginCliente}
      onOpenRegister={() => openView('registro')}
    />
  )

  const renderRegistro = () => (
    <RegisterPage
      form={registerForm}
      message={registerMessage}
      regiones={regionesChile}
      onChange={(next) => setRegisterForm(next)}
      onSubmit={handleRegisterSubmit}
      onOpenLogin={() => openView('login')}
    />
  )

  const renderPerfil = () => (
    <ProfilePage
      activeAccount={activeAccount}
      profileForm={profileForm}
      profileMessage={profileMessage}
      regiones={regionesChile}
      onOpenLogin={() => openView('login')}
      onOpenRegister={() => openView('registro')}
      onLogout={logoutCliente}
      onChange={(next) => setProfileForm(next)}
      onSubmit={saveProfile}
    />
  )

  const renderAdmin = () => (
    <AdminPage
      adminSession={adminSession}
      adminMessage={adminMessage}
      adminLoginForm={adminLoginForm}
      adminProductForm={adminProductForm}
      productEditingId={productEditingId}
      adminUserForm={adminUserForm}
      userEditingId={userEditingId}
      products={products}
      users={users}
      onUpdateLoginField={(field, value) => setAdminLoginForm({ ...adminLoginForm, [field]: value })}
      onAdminLogin={adminLogin}
      onLogoutAdmin={logoutAdmin}
      onUpdateProductField={(field, value) => setAdminProductForm({ ...adminProductForm, [field]: value })}
      onCreateOrUpdateProduct={createOrUpdateProduct}
      onEditProduct={handleEditProduct}
      onUpdateUserField={(field, value) => setAdminUserForm({ ...adminUserForm, [field]: value })}
      onCreateOrUpdateUser={createOrUpdateUser}
      onEditUser={handleEditUser}
    />
  )

  const navItems = [
    { label: 'Inicio', onClick: () => setActiveView('home') },
    { label: 'Nosotros', onClick: () => setActiveView('nosotros') },
    { label: 'Novedades', onClick: () => setActiveView('novedades') },
    { label: 'Catálogo', onClick: () => setActiveView('catalogo') },
    { label: 'Contacto', onClick: () => setActiveView('contacto') },
    { label: 'Iniciar sesión', onClick: () => setActiveView('login') },
    { label: 'Mi perfil', onClick: () => setActiveView('perfil') },
    { label: 'Registrarse', onClick: () => setActiveView('registro') },
    { label: 'Panel Admin', onClick: () => setActiveView('admin') },
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
