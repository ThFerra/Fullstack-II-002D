import { useEffect, useMemo, useState } from 'react'
import './App.css'
import './legacy-theme.css'

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

type Product = {
  id: number
  nombre: string
  categoria: string
  precio: number
  stock: number
  img: string
  descripcion: string
}

type UserRecord = {
  id: number
  run: string
  nombre: string
  correo: string
  rol: string
}

type CustomerAccount = {
  id: number
  run: string
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  tipo: string
  region: string
  comuna: string
  direccion: string
  passwordSalt: string
  passwordHash: string
}

type NewsItem = {
  title: string
  image: string
  imageAlt: string
  summary: string
  detail: string
}

const newsItems: NewsItem[] = [
  {
    title: 'Novedad de Brocas',
    image: '/img/images%20(3).jpg',
    imageAlt: 'Tipos de brocas para madera, metal y concreto',
    summary: 'Descubre la nueva línea de brocas para metal, madera y concreto con mejor duración.',
    detail: 'Elige la broca según el material que necesitas perforar: las brocas para madera ayudan a lograr cortes limpios, las de metal están diseñadas para trabajar superficies metálicas y las de concreto sirven para trabajos de albañilería. Si tienes dudas, nuestro equipo puede orientarte para escoger la adecuada.',
  },
  {
    title: 'Catálogo y stock actualizado',
    image: '/img/images%20(2).jpg',
    imageAlt: 'Ilustración de catálogo, inventario y búsqueda de productos',
    summary: 'Consulta nuestro catálogo para encontrar productos y revisar la disponibilidad para tu próximo proyecto.',
    detail: 'En el catálogo puedes revisar los productos disponibles, sus categorías, precios y stock registrado. Agrega los artículos que te interesan a tu selección y revisa el total antes de contactarnos para coordinar tu compra.',
  },
  {
    title: 'Protección para tus proyectos',
    image: '/img/D_NQ_NP_807165-MLM105543785741_012026-O.webp',
    imageAlt: 'Guantes de protección para trabajos de ferretería',
    summary: 'Encuentra guantes de trabajo para proteger tus manos durante tareas de construcción y mantención.',
    detail: 'Usar protección adecuada ayuda a reducir riesgos durante trabajos de construcción, reparación y mantención. Escoge guantes de acuerdo con la tarea y el material que vas a manipular; nuestro equipo puede ayudarte a encontrar una opción apropiada.',
  },
  {
    title: 'Fijaciones para cada trabajo',
    image: '/img/D_Q_NP_2X_698505-CBT112794574390_072026-T.webp',
    imageAlt: 'Caja organizadora con tornillos y fijaciones',
    summary: 'Tenemos surtidos de tornillos y fijaciones para reparaciones y proyectos de obra.',
    detail: 'Los tornillos, tarugos y otras fijaciones se deben elegir según el tipo de superficie y el peso que deben soportar. Revisa las opciones del catálogo y consúltanos si necesitas ayuda para encontrar la fijación adecuada para tu proyecto.',
  },
]

const categories = [
  { icon: '🧰', title: 'Herramientas', description: 'Taladros, llaves, sierras y equipos profesionales.' },
  { icon: '🔩', title: 'Ferretería', description: 'Tornillería, clavos, tornillos y accesorios para obra.' },
  { icon: '⚡', title: 'Electricidad', description: 'Cableado, interruptores, tomacorrientes y materiales eléctricos.' },
  { icon: '🎨', title: 'Pintura', description: 'Brochas, rodillos, pinturas y soluciones para remodelaciones.' },
]

const localImages = {
  logo: '/img/Captura%20de%20pantalla%202026-10-24%20195817.png',
  cemento: '/img/images%20(1).jpg',
  taladro: '/img/Taladro-Percutor-Bosch-13mm-800w-Gsb-20-2-Re.webp',
  alicates: '/img/8120020-set-de-alicates-ergonomicos-8-3-pcs-wellborn.jpg',
  llave: '/img/D_NQ_NP_955306-MLC92240553458_092025-O.webp',
  martillo: '/img/D_NQ_NP_608125-MLA99500492814_112025-O.webp',
  destornilladores: '/img/w=1500,h=1500,fit=cover.jpg',
  pintura: '/img/w=1500,h=1500,fit=cover.webp',
  tarugos: '/img/D_Q_NP_2X_698505-CBT112794574390_072026-T.webp',
}

const benefits = [
  'Atención experta para obra y hogar',
  'Precios competitivos y entrega rápida',
  'Marcas confiables y productos certificados',
  'Asesoría personalizada en cada compra',
]

const initialProducts: Product[] = [
  {
    id: 1,
    nombre: 'Saco Cemento Polpaico 25kg',
    categoria: 'Construcción',
    precio: 4890,
    stock: 150,
    img: localImages.cemento,
    descripcion: 'Cemento de alta resistencia para obra civil y remodelaciones.',
  },
  {
    id: 2,
    nombre: 'Taladro Percutor 18V',
    categoria: 'Herramientas eléctricas',
    precio: 79990,
    stock: 12,
    img: localImages.taladro,
    descripcion: 'Taladro de alto torque para perforación y impacto profesional.',
  },
  {
    id: 3,
    nombre: 'Set Alicates Profesionales',
    categoria: 'Herramientas manuales',
    precio: 15990,
    stock: 25,
    img: localImages.alicates,
    descripcion: 'Set de aletes de precisión y uso intensivo en taller.',
  },
  {
    id: 4,
    nombre: 'Llave Monomando Lavaplatos',
    categoria: 'Gasfitería',
    precio: 22990,
    stock: 8,
    img: localImages.llave,
    descripcion: 'Llave para lavaplatos y conexiones de agua con alta durabilidad.',
  },
  {
    id: 5,
    nombre: 'Martillo Galponero 16 oz',
    categoria: 'Herramientas manuales',
    precio: 8990,
    stock: 30,
    img: localImages.martillo,
    descripcion: 'Martillo resistente para trabajos de carpintería y obra.',
  },
  {
    id: 6,
    nombre: 'Set de Destornilladores 6 piezas',
    categoria: 'Herramientas manuales',
    precio: 7490,
    stock: 42,
    img: localImages.destornilladores,
    descripcion: 'Completo juego de destornilladores para uso general y técnico.',
  },
  {
    id: 7,
    nombre: 'Pintura Látex Blanca 1 galón',
    categoria: 'Pinturas',
    precio: 18990,
    stock: 18,
    img: localImages.pintura,
    descripcion: 'Pintura interior/exterior para fachadas, habitaciones y acabados.',
  },
  {
    id: 8,
    nombre: 'Caja de Tarugos y Tornillos',
    categoria: 'Fijaciones',
    precio: 5990,
    stock: 65,
    img: localImages.tarugos,
    descripcion: 'Set de fijación esencial para obras y mantención doméstica.',
  },
]

const defaultUsers: UserRecord[] = [
  { id: 1, run: '12345678K', nombre: 'Juan Pérez', correo: 'juan.perez@email.com', rol: 'Contratista' },
  { id: 2, run: '18765432-1', nombre: 'María González', correo: 'maria.g@email.com', rol: 'Vendedor' },
]

const demoCustomerAccount: CustomerAccount = {
  id: 0,
  run: '',
  nombre: 'Cliente',
  apellidos: 'de prueba',
  correo: 'cliente@losmaestros.cl',
  telefono: '',
  tipo: 'Cliente',
  region: 'Coquimbo',
  comuna: 'La Serena',
  direccion: '',
  passwordSalt: '',
  passwordHash: '',
}

const createPasswordHash = async (password: string, salt?: string) => {
  const passwordSalt = salt ?? crypto.randomUUID()
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(passwordSalt), iterations: 150_000, hash: 'SHA-256' },
    key,
    256,
  )
  const passwordHash = btoa(String.fromCharCode(...new Uint8Array(hash)))
  return { passwordSalt, passwordHash }
}

const regionesChile = [
  { nombre: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre'] },
  { nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte'] },
  { nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Vicuña'] },
  { nombre: 'Metropolitana de Santiago', comunas: ['Santiago', 'Maipú', 'Puente Alto'] },
]

const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')}`

const validarEmail = (correo:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

const validarRun = (run: string) => {
  const runLimpio = run.replace(/[^0-9kK]/g, '').toUpperCase()
  if (!/^\d{7,8}[0-9K]$/.test(runLimpio)) return false

  const cuerpo = runLimpio.slice(0, -1)
  const verificador = runLimpio.slice(-1)
  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return verificador === esperado
}

const registrarActividad = (descripcion: string) => {
  const actividad = JSON.parse(localStorage.getItem('actividad_maestros') || '[]') as Array<{ descripcion: string; fecha: string }>
  actividad.unshift({ descripcion, fecha: new Date().toLocaleString('es-CL') })
  localStorage.setItem('actividad_maestros', JSON.stringify(actividad.slice(0, 30)))
}

const obtenerCuentaActiva = (): CustomerAccount | null => {
  const correo = sessionStorage.getItem('los_maestros_user_email')
  if (!correo) return null
  if (correo.toLowerCase() === demoCustomerAccount.correo) return demoCustomerAccount

  const saved = JSON.parse(localStorage.getItem('cuentas_maestros') || '[]') as CustomerAccount[]
  return saved.find((account) => account.correo.toLowerCase() === correo.toLowerCase()) ?? null
}

const crearFormularioPerfil = (account: CustomerAccount | null) => ({
  nombre: account?.nombre ?? '',
  apellidos: account?.apellidos ?? '',
  correo: account?.correo ?? '',
  telefono: account?.telefono ?? '',
  region: account?.region ?? '',
  comuna: account?.comuna ?? '',
  direccion: account?.direccion ?? '',
})

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
  const [activeAccount, setActiveAccount] = useState<CustomerAccount | null>(obtenerCuentaActiva)
  const [adminSession, setAdminSession] = useState(
    () => sessionStorage.getItem('los_maestros_admin_session') === 'active',
  )
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
  const [profileForm, setProfileForm] = useState(() => crearFormularioPerfil(activeAccount))
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

  const featuredProducts = useMemo(() => products.slice(0, 3), [products])
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
      setProfileForm(crearFormularioPerfil(signedInAccount))
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
    setProfileForm(crearFormularioPerfil(newAccount))
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
    setProfileForm(crearFormularioPerfil(updatedAccount))
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
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Todo para construir, reparar y mejorar</p>
          <h1>Materiales de construcción, herramientas y ferretería general.</h1>
          <p>
            22 años al servicio de particulares y contratistas en La Serena con productos para obra,
            hogar y mantenimiento.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => openView('catalogo')}>
              Ver catálogo
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => openView('nosotros')}>
              Nuestra historia
            </button>
          </div>
          <div className="stats-grid">
            <div><strong>+1,200</strong><span>Productos</span></div>
            <div><strong>15 años</strong><span>Experiencia</span></div>
            <div><strong>4.9/5</strong><span>Clientes</span></div>
          </div>
        </div>

        <div className="hero-panel">
          <span className="panel-badge">Entrega hoy</span>
          <h2>Lo que más compran</h2>
          <ul className="mini-list">
            <li>
              <span>🧱</span>
              <div><strong>Cemento</strong><small>Desde $4.890</small></div>
            </li>
            <li>
              <span>🔧</span>
              <div><strong>Taladro Percutor</strong><small>Desde $79.990</small></div>
            </li>
            <li>
              <span>🎨</span>
              <div><strong>Pintura Látex</strong><small>Desde $18.990</small></div>
            </li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Nuestras categorías</p>
          <h2>Todo lo que necesitas en un solo lugar</h2>
        </div>
        <div className="cards-grid">
          {categories.map((category) => (
            <article className="info-card" key={category.title}>
              <div className="card-icon">{category.icon}</div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Productos destacados</p>
          <h2>Recomendados para ti</h2>
        </div>
        <div className="product-grid row g-4">
          {featuredProducts.map((product) => (
            <article className="col-12 col-md-6 col-lg-4" key={product.id}>
              <div className="product-card card h-100">
                <div className="product-tag">Popular</div>
                <img className="card-img-top" src={product.img} alt={product.nombre} />
                <div className="card-body d-flex flex-column">
                  <h3 className="card-title">{product.nombre}</h3>
                  <div className="product-meta mt-auto">
                    <span>{formatPrice(product.precio)}</span>
                    <button type="button" className="btn btn-secondary" onClick={() => addToCart(product)}>Agregar</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block benefits-grid">
        <div>
          <div className="section-heading">
            <p className="eyebrow">¿Por qué elegirnos?</p>
            <h2>Soluciones confiables para obra, hogar y negocio</h2>
          </div>
          <p className="lead-text">
            Somos una ferretería con enfoque en servicio, rapidez y calidad. Trabajamos con materiales
            durables y acompañamos cada compra con asesoría experta para proyectos reales.
          </p>
          <ul className="benefits-list">
            {benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="info-boxes">
          <div className="mini-box">
            <span>Horario</span>
            <strong>Lun - Sab</strong>
            <small>8:00 AM - 7:00 PM</small>
          </div>
          <div className="mini-box accent">
            <span>Atención</span>
            <strong>Presupuesto gratis</strong>
            <small>Sin compromiso</small>
          </div>
        </div>
      </section>
    </>
  )

  const renderNosotros = () => (
    <>
      <section className="about-hero">
        <div className="about-copy">
          <p className="eyebrow">Ferretería Los Maestros · La Serena</p>
          <h1>Nuestra historia y compromiso</h1>
          <p>
            Llevamos más de 22 años brindando soluciones en herramientas, materiales de construcción
            y ferretería general a particulares y contratistas de la Región de Coquimbo.
          </p>
          <p>
            Queremos que cada persona encuentre los materiales adecuados para construir, reparar y
            mejorar, con atención cercana y orientación para sus proyectos.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => openView('catalogo')}>
              Explorar catálogo
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => openView('contacto')}>
              Contáctanos
            </button>
          </div>
        </div>
        <div className="about-brand-panel" aria-label="Ferretería Los Maestros en La Serena">
          <img src={localImages.logo} alt="Logotipo de Ferretería Los Maestros" />
          <strong>Experiencia que construye confianza</strong>
          <span>Atención a particulares y contratistas</span>
        </div>
      </section>

      <section className="section-block about-values">
        <div className="section-heading">
          <p className="eyebrow">Lo que nos mueve</p>
          <h2>Un aliado para cada proyecto</h2>
          <p className="about-section-intro">
            Desde una reparación en casa hasta el abastecimiento de una obra, nuestro propósito es
            ofrecer productos confiables y una atención que ayude a avanzar.
          </p>
        </div>
        <div className="row g-4">
          <article className="col-12 col-md-4">
            <div className="about-value-card h-100">
              <span className="about-value-icon">🧰</span>
              <h3>Variedad</h3>
              <p>Herramientas, materiales y artículos de ferretería para distintas necesidades.</p>
            </div>
          </article>
          <article className="col-12 col-md-4">
            <div className="about-value-card h-100">
              <span className="about-value-icon">🤝</span>
              <h3>Atención cercana</h3>
              <p>Orientación para que puedas elegir lo que mejor se adapta a tu trabajo.</p>
            </div>
          </article>
          <article className="col-12 col-md-4">
            <div className="about-value-card h-100">
              <span className="about-value-icon">📍</span>
              <h3>Compromiso local</h3>
              <p>Al servicio de La Serena y la Región de Coquimbo desde hace más de dos décadas.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="about-project section-block">
        <div>
          <p className="eyebrow">Nuestro sitio</p>
          <h2>Una experiencia simple para encontrar lo que necesitas</h2>
          <p>
            Este proyecto reúne el catálogo, la selección de productos y los canales de contacto en
            un solo lugar. Revisa los productos disponibles y prepara tu solicitud de compra.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openView('catalogo')}>
          Ver productos
        </button>
      </section>
    </>
  )

  const renderCatalogo = () => (
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
                    <button type="button" className="btn btn-secondary" onClick={() => openView('catalogo', product.id)}>
                      Ver detalle
                    </button>
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
                <button type="button" onClick={() => removeFromCart(index)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <strong>Total:</strong>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <button type="button" className="btn btn-secondary full-width" onClick={() => setCart([])}>
          Vaciar carrito
        </button>
      </aside>
    </section>
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
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Novedades</p>
        <h2>Noticias y promociones</h2>
      </div>
      <div className="news-grid row g-4">
        {newsItems.map((item) => (
          <article className="col-12 col-md-6" key={item.title}>
            <button
              type="button"
              className="news-card card h-100 w-100 text-start"
              onClick={() => setSelectedNews(item)}
              aria-label={`Ver información: ${item.title}`}
            >
              <img className="card-img-top news-image" src={item.image} alt={item.imageAlt} />
              <span className="card-body">
                <span className="card-title news-title">{item.title}</span>
                <span className="card-text news-summary">{item.summary}</span>
                <span className="news-more">Ver información</span>
              </span>
            </button>
          </article>
        ))}
      </div>
      {selectedNews && (
        <div className="news-modal-layer" role="presentation" onClick={() => setSelectedNews(null)}>
          <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content news-modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5" id="news-modal-title">{selectedNews.title}</h2>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setSelectedNews(null)} />
                </div>
                <div className="modal-body">
                  <img className="news-modal-image" src={selectedNews.image} alt={selectedNews.imageAlt} />
                  <p>{selectedNews.detail}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => setSelectedNews(null)}>Entendido</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )

  const renderContacto = () => (
    <section className="section-block contact-layout">
      <div className="contact-card">
        <div className="section-heading">
          <p className="eyebrow">Contacto</p>
          <h2>Escríbenos</h2>
        </div>
        <form onSubmit={handleContactSubmit} className="form-box">
          <label>
            Nombre
            <input value={contactForm.nombre} onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })} />
          </label>
          <label>
            Correo
            <input value={contactForm.correo} onChange={(e) => setContactForm({ ...contactForm, correo: e.target.value })} />
          </label>
          <label>
            Mensaje
            <textarea value={contactForm.mensaje} onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })} rows={5} />
          </label>
          {contactMessage && <p className="form-message">{contactMessage}</p>}
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

  const renderLogin = () => (
    <section className="section-block form-layout">
      <div className="form-card">
        <div className="section-heading">
          <p className="eyebrow">Iniciar sesión</p>
          <h2>Accede a tu cuenta</h2>
        </div>
        <form onSubmit={loginCliente} className="form-box">
          <label>
            Correo
            <input type="email" autoComplete="email" value={loginForm.correo} onChange={(e) => setLoginForm({ ...loginForm, correo: e.target.value })} />
          </label>
          <label>
            Contraseña
            <input type="password" autoComplete="current-password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          </label>
          {loginMessage && <p className="form-message">{loginMessage}</p>}
          <button type="submit" className="btn btn-primary">Ingresar</button>
          <p className="account-switch">¿Todavía no tienes cuenta? <button type="button" onClick={() => openView('registro')}>Crear cuenta</button></p>
        </form>
      </div>
    </section>
  )

  const renderRegistro = () => (
    <section className="section-block form-layout">
      <div className="form-card wide-form">
        <div className="section-heading">
          <p className="eyebrow">Registro</p>
          <h2>Crea tu cuenta</h2>
        </div>
        <form onSubmit={handleRegisterSubmit} className="form-box">
          <div className="two-columns">
            <label>
              RUN
              <input autoComplete="off" value={registerForm.run} onChange={(e) => setRegisterForm({ ...registerForm, run: e.target.value })} required />
            </label>
            <label>
              Nombre
              <input autoComplete="given-name" value={registerForm.nombre} onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })} required />
            </label>
            <label>
              Apellidos
              <input autoComplete="family-name" value={registerForm.apellidos} onChange={(e) => setRegisterForm({ ...registerForm, apellidos: e.target.value })} required />
            </label>
            <label>
              Correo
              <input type="email" autoComplete="email" value={registerForm.correo} onChange={(e) => setRegisterForm({ ...registerForm, correo: e.target.value })} required />
            </label>
            <label>
              Teléfono de contacto
              <input type="tel" autoComplete="tel" value={registerForm.telefono} onChange={(e) => setRegisterForm({ ...registerForm, telefono: e.target.value })} placeholder="+56 9 1234 5678" required />
            </label>
            <label>
              Tipo de usuario
              <select value={registerForm.tipo} onChange={(e) => setRegisterForm({ ...registerForm, tipo: e.target.value })} required>
                <option value="">Seleccione</option>
                <option value="Contratista">Contratista</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Cliente">Cliente</option>
              </select>
            </label>
            <label>
              Región
              <select autoComplete="address-level1" value={registerForm.region} onChange={(e) => setRegisterForm({ ...registerForm, region: e.target.value, comuna: '' })} required>
                <option value="">Seleccione región</option>
                {regionesChile.map((region) => (
                  <option key={region.nombre} value={region.nombre}>{region.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Comuna
              <select autoComplete="address-level2" value={registerForm.comuna} onChange={(e) => setRegisterForm({ ...registerForm, comuna: e.target.value })} disabled={!registerForm.region} required>
                <option value="">Seleccione comuna</option>
                {regionesChile
                  .find((region) => region.nombre === registerForm.region)
                  ?.comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>{comuna}</option>
                  ))}
              </select>
            </label>
            <label>
              Dirección
              <input autoComplete="street-address" value={registerForm.direccion} onChange={(e) => setRegisterForm({ ...registerForm, direccion: e.target.value })} required />
            </label>
            <label>
              Contraseña
              <input type="password" autoComplete="new-password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} minLength={8} required />
            </label>
            <label>
              Repite tu contraseña
              <input type="password" autoComplete="new-password" value={registerForm.confirmarPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmarPassword: e.target.value })} minLength={8} required />
            </label>
          </div>
          <small className="form-help">Usa al menos 8 caracteres e incluye letras y números.</small>
          {registerMessage && <p className="form-message">{registerMessage}</p>}
          <button type="submit" className="btn btn-primary">Crear mi cuenta</button>
          <p className="account-switch">¿Ya tienes cuenta? <button type="button" onClick={() => openView('login')}>Iniciar sesión</button></p>
        </form>
      </div>
    </section>
  )

  const renderPerfil = () => (
    <section className="section-block profile-layout">
      {!activeAccount ? (
        <div className="profile-card profile-guest">
          <p className="eyebrow">Tu cuenta</p>
          <h2>Ingresa para ver tu perfil</h2>
          <p>Inicia sesión o crea una cuenta para guardar tus datos y dirección de contacto.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => openView('login')}>Iniciar sesión</button>
            <button type="button" className="btn btn-secondary" onClick={() => openView('registro')}>Crear cuenta</button>
          </div>
        </div>
      ) : (
        <div className="profile-card profile-account-card">
          <div className="profile-heading-row">
            <div>
              <p className="eyebrow">Mi cuenta</p>
              <h2>Hola, {activeAccount.nombre}</h2>
              <p className="profile-email">Administra tus datos y dirección de contacto.</p>
            </div>
            <button type="button" className="btn btn-outline-secondary" onClick={logoutCliente}>Cerrar sesión</button>
          </div>

          <div className="account-summary-grid">
            <div className="account-summary-item"><span>Cuenta</span><strong>{activeAccount.tipo || 'Cliente'}</strong></div>
            <div className="account-summary-item"><span>Correo registrado</span><strong>{activeAccount.correo}</strong></div>
            <div className="account-summary-item"><span>Dirección</span><strong>{activeAccount.direccion || 'Agrega tu dirección'}</strong></div>
          </div>

          <form className="form-box profile-edit-form" onSubmit={saveProfile}>
            <div className="profile-section-heading">
              <h3>Datos personales y dirección</h3>
              <p>Estos datos se guardan en esta cuenta para futuras visitas.</p>
            </div>
            <div className="two-columns">
              <label>Nombre<input autoComplete="given-name" value={profileForm.nombre} onChange={(event) => setProfileForm({ ...profileForm, nombre: event.target.value })} required /></label>
              <label>Apellidos<input autoComplete="family-name" value={profileForm.apellidos} onChange={(event) => setProfileForm({ ...profileForm, apellidos: event.target.value })} required /></label>
              <label>Correo electrónico<input type="email" autoComplete="email" value={profileForm.correo} onChange={(event) => setProfileForm({ ...profileForm, correo: event.target.value })} required /></label>
              <label>Teléfono<input type="tel" autoComplete="tel" value={profileForm.telefono} onChange={(event) => setProfileForm({ ...profileForm, telefono: event.target.value })} required /></label>
              <label>Región<select autoComplete="address-level1" value={profileForm.region} onChange={(event) => setProfileForm({ ...profileForm, region: event.target.value, comuna: '' })} required>
                <option value="">Selecciona región</option>
                {regionesChile.map((region) => <option key={region.nombre} value={region.nombre}>{region.nombre}</option>)}
              </select></label>
              <label>Comuna<select autoComplete="address-level2" value={profileForm.comuna} onChange={(event) => setProfileForm({ ...profileForm, comuna: event.target.value })} disabled={!profileForm.region} required>
                <option value="">Selecciona comuna</option>
                {regionesChile.find((region) => region.nombre === profileForm.region)?.comunas.map((comuna) => <option key={comuna} value={comuna}>{comuna}</option>)}
              </select></label>
              <label className="full-span">Dirección<input autoComplete="street-address" value={profileForm.direccion} onChange={(event) => setProfileForm({ ...profileForm, direccion: event.target.value })} required /></label>
            </div>
            {profileMessage && <p className="form-message" role="status">{profileMessage}</p>}
            <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </form>

          <div className="profile-box">
            <h3>Actividad reciente</h3>
            <ul className="activity-list">
              {JSON.parse(localStorage.getItem('actividad_maestros') || '[]').slice(0, 5).map((item: { descripcion: string; fecha: string }, index: number) => (
                <li key={`${item.descripcion}-${index}`}><span>{item.descripcion}</span><small>{item.fecha}</small></li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )

  const renderAdmin = () => (
    <section className="section-block admin-layout">
      {!adminSession ? (
        <div className="form-card">
          <div className="section-heading">
            <p className="eyebrow">Panel admin</p>
            <h2>Acceso administrador</h2>
          </div>
          <form onSubmit={adminLogin} className="form-box">
            <label>
              Correo
              <input value={adminLoginForm.correo} onChange={(e) => setAdminLoginForm({ ...adminLoginForm, correo: e.target.value })} />
            </label>
            <label>
              Contraseña
              <input type="password" value={adminLoginForm.password} onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })} />
            </label>
            {adminMessage && <p className="form-message">{adminMessage}</p>}
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </form>
        </div>
      ) : (
        <div className="admin-panel">
          <div className="admin-header">
            <h2>Panel administrador</h2>
            <button type="button" className="btn btn-secondary" onClick={logoutAdmin}>Cerrar sesión</button>
          </div>

          <div className="admin-sections">
            <div className="admin-card">
              <h3>Gestión de productos</h3>
              <form onSubmit={createOrUpdateProduct} className="form-box compact-form">
                <label>
                  Nombre
                  <input value={adminProductForm.nombre} onChange={(e) => setAdminProductForm({ ...adminProductForm, nombre: e.target.value })} />
                </label>
                <label>
                  Precio
                  <input type="number" value={adminProductForm.precio} onChange={(e) => setAdminProductForm({ ...adminProductForm, precio: e.target.value })} />
                </label>
                <label>
                  Stock
                  <input type="number" value={adminProductForm.stock} onChange={(e) => setAdminProductForm({ ...adminProductForm, stock: e.target.value })} />
                </label>
                <label>
                  Categoría
                  <input value={adminProductForm.categoria} onChange={(e) => setAdminProductForm({ ...adminProductForm, categoria: e.target.value })} />
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
                    <button type="button" className="btn btn-secondary" onClick={() => handleEditProduct(product)}>
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <h3>Gestión de usuarios</h3>
              <form onSubmit={createOrUpdateUser} className="form-box compact-form">
                <label>
                  RUN
                  <input value={adminUserForm.run} onChange={(e) => setAdminUserForm({ ...adminUserForm, run: e.target.value })} />
                </label>
                <label>
                  Nombre
                  <input value={adminUserForm.nombre} onChange={(e) => setAdminUserForm({ ...adminUserForm, nombre: e.target.value })} />
                </label>
                <label>
                  Correo
                  <input value={adminUserForm.correo} onChange={(e) => setAdminUserForm({ ...adminUserForm, correo: e.target.value })} />
                </label>
                <label>
                  Rol
                  <select value={adminUserForm.rol} onChange={(e) => setAdminUserForm({ ...adminUserForm, rol: e.target.value })}>
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
                    <button type="button" className="btn btn-secondary" onClick={() => handleEditUser(user)}>
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )

  return (
    <div className="app-shell">
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

        <nav className="main-nav navbar-nav flex-row flex-wrap">
          <button type="button" className="nav-link" onClick={() => setActiveView('home')}>Inicio</button>
          <button type="button" className="nav-link" onClick={() => setActiveView('nosotros')}>Nosotros</button>
          <button type="button" className="nav-link" onClick={() => setActiveView('novedades')}>Novedades</button>
          <button type="button" className="nav-link" onClick={() => setActiveView('catalogo')}>Catálogo</button>
          <button type="button" className="nav-link" onClick={() => setActiveView('contacto')}>Contacto</button>
          <button type="button" className="nav-link" onClick={() => setActiveView('login')}>Iniciar sesión</button>
          <button type="button" className="nav-link" onClick={() => setActiveView('perfil')}>Mi perfil</button>
          <button type="button" className="nav-link" onClick={() => setActiveView('registro')}>Registrarse</button>
          <button type="button" className="nav-link admin-link" onClick={() => setActiveView('admin')}>Panel Admin</button>
        </nav>
      </header>

      <main className="page-content container">
        {activeView === 'home' && renderHome()}
        {activeView === 'catalogo' && (selectedProduct ? renderDetalle() : renderCatalogo())}
        {activeView === 'nosotros' && renderNosotros()}
        {activeView === 'novedades' && renderNovedades()}
        {activeView === 'contacto' && renderContacto()}
        {activeView === 'login' && renderLogin()}
        {activeView === 'registro' && renderRegistro()}
        {activeView === 'perfil' && renderPerfil()}
        {activeView === 'admin' && renderAdmin()}
      </main>

      <footer className="site-footer">
        <p>© 2026 Ferretería Los Maestros - La Serena, Región de Coquimbo. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
