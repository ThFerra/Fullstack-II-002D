// Backend simulado para las pruebas (no es un archivo de pruebas).
// Reemplaza a fetch y responde como lo harían los 7 microservicios reales,
// así las pruebas no necesitan tener el backend encendido.
import { vi } from "vitest";

type Json = Record<string, unknown>;

export type Llamada = { method: string; ruta: string; body?: Json; token?: string };

function responder(status: number, body?: unknown): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
        text: async () => (body === undefined ? "" : JSON.stringify(body)),
    } as unknown as Response;
}

const error = (status: number, mensaje: string) => responder(status, { status, mensaje });

export function crearBackendFalso(opciones: { caido?: boolean } = {}) {
    const productos = [
        { id: 1, nombre: "Saco Cemento Polpaico 25kg", descripcion: "Cemento de alta resistencia.", precio: 4890, imagen: "/img/1.jpg", categoriaId: 1, categoria: "Construcción" },
        { id: 2, nombre: "Taladro Percutor 18V", descripcion: "Taladro de alto torque.", precio: 79990, imagen: "/img/2.jpg", categoriaId: 2, categoria: "Herramientas eléctricas" },
        { id: 3, nombre: "Set Alicates Profesionales", descripcion: "Alicates de precisión.", precio: 15990, imagen: "/img/3.jpg", categoriaId: 3, categoria: "Herramientas manuales" },
        { id: 4, nombre: "Llave Monomando Lavaplatos", descripcion: "Llave para lavaplatos.", precio: 22990, imagen: "/img/4.jpg", categoriaId: 4, categoria: "Gasfitería" },
        { id: 5, nombre: "Martillo Galponero 16 oz", descripcion: "Martillo resistente.", precio: 8990, imagen: "/img/5.jpg", categoriaId: 3, categoria: "Herramientas manuales" },
        { id: 6, nombre: "Set de Destornilladores 6 piezas", descripcion: "Juego de destornilladores.", precio: 7490, imagen: "/img/6.jpg", categoriaId: 3, categoria: "Herramientas manuales" },
        { id: 7, nombre: "Pintura Látex Blanca 1 galón", descripcion: "Pintura interior/exterior.", precio: 18990, imagen: "/img/7.jpg", categoriaId: 5, categoria: "Pinturas" },
        { id: 8, nombre: "Caja de Tarugos y Tornillos", descripcion: "Set de fijación.", precio: 5990, imagen: "/img/8.jpg", categoriaId: 6, categoria: "Fijaciones" },
    ];
    const categorias = [
        { id: 1, nombre: "Construcción" }, { id: 2, nombre: "Herramientas eléctricas" },
        { id: 3, nombre: "Herramientas manuales" }, { id: 4, nombre: "Gasfitería" },
        { id: 5, nombre: "Pinturas" }, { id: 6, nombre: "Fijaciones" },
    ];
    const stock = new Map<number, number>([[1, 150], [2, 12], [3, 25], [4, 8], [5, 30], [6, 42], [7, 18], [8, 65]]);

    const cuentas = new Map<string, { password: string; rol: "ADMIN" | "CLIENTE" }>([
        ["admin@losmaestros.cl", { password: "Admin123", rol: "ADMIN" }],
        ["cliente@losmaestros.cl", { password: "Cliente123", rol: "CLIENTE" }],
    ]);
    const perfiles = new Map<string, Json>([
        ["admin@losmaestros.cl", { id: 1, run: "222222222", nombre: "Administrador", apellidos: "Los Maestros", correo: "admin@losmaestros.cl", telefono: "+56 9 1234 5678", tipo: "Administrador", region: "Coquimbo", comuna: "La Serena", direccion: "Av. del Mar 123" }],
        ["cliente@losmaestros.cl", { id: 2, run: "111111111", nombre: "Cliente", apellidos: "de prueba", correo: "cliente@losmaestros.cl", telefono: "+56 9 8765 4321", tipo: "Cliente", region: "Coquimbo", comuna: "La Serena", direccion: "Calle Ejemplo 456" }],
    ]);
    const carritos = new Map<string, Map<number, number>>();
    const llamadas: Llamada[] = [];

    const tokens = (correo: string) => ({
        accessToken: `token:${correo}`, refreshToken: `refresh:${correo}`, tipo: "Bearer",
        expiraEnSegundos: 900, correo, rol: cuentas.get(correo)!.rol,
    });

    const verCarrito = (correo: string) => {
        const items = [...(carritos.get(correo) ?? new Map()).entries()].map(([productoId, cantidad]) => {
            const p = productos.find((x) => x.id === productoId)!;
            return { productoId, nombre: p.nombre, imagen: p.imagen, precioUnitario: p.precio, cantidad, subtotal: p.precio * cantidad };
        });
        return { usuario: correo, items, totalUnidades: items.reduce((s, i) => s + i.cantidad, 0), total: items.reduce((s, i) => s + i.subtotal, 0) };
    };

    const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
        if (opciones.caido) {
            throw new TypeError("Failed to fetch");
        }
        const method = (init.method ?? "GET").toUpperCase();
        const { pathname } = new URL(url);
        const headers = (init.headers ?? {}) as Record<string, string>;
        const token = headers.Authorization?.replace("Bearer ", "");
        const body = init.body ? (JSON.parse(String(init.body)) as Json) : undefined;
        llamadas.push({ method, ruta: pathname, body, token });

        const correo = token?.startsWith("token:") ? token.slice(6) : undefined;
        const rol = correo ? cuentas.get(correo)?.rol : undefined;
        const ruta = `${method} ${pathname}`;

        // ----- Autenticación -----
        if (ruta === "POST /api/auth/login") {
            const cuenta = cuentas.get(String(body?.correo));
            if (!cuenta || cuenta.password !== body?.password) {
                return error(401, "El correo o la contraseña no coinciden con una cuenta registrada.");
            }
            return responder(200, tokens(String(body?.correo)));
        }
        if (ruta === "POST /api/auth/refresh") {
            const dueño = String(body?.refreshToken ?? "").replace("refresh:", "");
            return cuentas.has(dueño) ? responder(200, tokens(dueño)) : error(401, "La sesión expiró.");
        }
        if (ruta === "POST /api/auth/logout") return responder(200, { mensaje: "Sesión cerrada." });

        // ----- Públicos -----
        if (ruta === "GET /api/productos") return responder(200, productos);
        if (ruta === "GET /api/categorias") return responder(200, categorias);
        if (ruta === "GET /api/inventario") return responder(200, [...stock.entries()].map(([productoId, cantidad]) => ({ productoId, cantidad, stockMinimo: 5, critico: cantidad <= 5 })));
        if (ruta === "GET /api/noticias") return responder(200, [{ id: 1, titulo: "Novedad de Brocas", imagen: "/img/b.jpg", imagenAlt: "Brocas", resumen: "Nueva línea de brocas.", detalle: "Detalle de brocas.", publicada: true }]);
        if (ruta === "GET /api/regiones") return responder(200, [{ nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Vicuña"] }, { nombre: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte"] }]);
        if (ruta === "POST /api/contacto") return responder(201, { mensaje: "Consulta enviada correctamente.", consultaId: 1 });
        if (ruta === "POST /api/usuarios/registro") {
            const nuevo = String(body?.correo);
            if (cuentas.has(nuevo)) return error(409, "Ya existe una cuenta con ese correo. Inicia sesión o utiliza otro correo.");
            cuentas.set(nuevo, { password: String(body?.password), rol: "CLIENTE" });
            const perfil = { ...body, id: perfiles.size + 10 };
            perfiles.set(nuevo, perfil);
            return responder(201, perfil);
        }

        // ----- Privados: requieren token -----
        if (!correo || !rol) return error(401, "Debes iniciar sesión o tu token expiró.");
        const soloAdmin = () => (rol === "ADMIN" ? null : error(403, "No tienes permisos para realizar esta acción."));

        if (ruta === "GET /api/usuarios/me") return responder(200, perfiles.get(correo));
        if (ruta === "GET /api/carrito") return responder(200, verCarrito(correo));
        if (ruta === "DELETE /api/carrito") { carritos.delete(correo); return responder(200, verCarrito(correo)); }
        if (ruta === "POST /api/carrito/items") {
            const id = Number(body?.productoId);
            const carrito = carritos.get(correo) ?? new Map<number, number>();
            const enCarrito = carrito.get(id) ?? 0;
            const disponible = stock.get(id) ?? 0;
            if (enCarrito + Number(body?.cantidad) > disponible) {
                return error(409, `Stock insuficiente: quedan ${disponible} unidad(es).`);
            }
            carrito.set(id, enCarrito + Number(body?.cantidad));
            carritos.set(correo, carrito);
            return responder(200, verCarrito(correo));
        }
        const quitarItem = pathname.match(/^\/api\/carrito\/items\/(\d+)$/);
        if (method === "DELETE" && quitarItem) {
            carritos.get(correo)?.delete(Number(quitarItem[1]));
            return responder(200, verCarrito(correo));
        }

        if (ruta === "GET /api/usuarios") return soloAdmin() ?? responder(200, [...perfiles.values()]);
        if (ruta === "POST /api/productos") {
            const denegado = soloAdmin();
            if (denegado) return denegado;
            const nuevo = { id: productos.length + 1, nombre: String(body?.nombre), descripcion: "Nuevo", precio: Number(body?.precio), imagen: String(body?.imagen), categoriaId: Number(body?.categoriaId), categoria: categorias.find((c) => c.id === Number(body?.categoriaId))?.nombre ?? "" };
            productos.push(nuevo);
            stock.set(nuevo.id, Number(body?.stockInicial ?? 0));
            return responder(201, nuevo);
        }

        return error(404, `Ruta no simulada: ${ruta}`);
    });

    return { fetchMock, llamadas, stock, cuentas };
}
