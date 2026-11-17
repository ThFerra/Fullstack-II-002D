export type Product = {
  id: number
  nombre: string
  categoria: string
  precio: number
  stock: number
  img: string
  descripcion: string
}

export type NewsItem = {
  title: string
  image: string
  imageAlt: string
  summary: string
  detail: string
}

export const localImages = {
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

export const newsItems: NewsItem[] = [
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

export const initialProducts: Product[] = [
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

export const formatPrice = (value: number) => `$${value.toLocaleString('es-CL')}`
