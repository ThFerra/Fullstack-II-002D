# Ferretería Los Maestros — Frontend (React + Vite)

Tienda web conectada al backend de **7 microservicios Spring Boot** (`ferreteria-backend`).

## Cómo ejecutar

1. Enciende MySQL y los 7 microservicios del backend (`iniciar-todos.ps1` en `ferreteria-backend`).
2. En esta carpeta:
   ```powershell
   npm install
   npm run dev
   ```
3. Abre http://localhost:5173

Pruebas unitarias: `npx vitest run` (20 pruebas; usan un backend simulado, no necesitan el backend encendido).

## Integración con el backend

| Carpeta | Qué hace |
|---|---|
| `src/api/config.ts` | Direcciones de los microservicios (se pueden cambiar con un archivo `.env`, ver `.env.example`) |
| `src/api/session.ts` | Sesión del usuario: guarda los tokens JWT en `localStorage`, la mantiene al recargar y la sincroniza entre pestañas |
| `src/api/http.ts` | Cliente HTTP: agrega `Authorization: Bearer <token>`, renueva el token automáticamente con el refresh token y traduce los errores del backend |
| `src/api/services.ts` | Una función por endpoint de cada microservicio |

**Restricciones por rol:**
- El menú muestra "Iniciar sesión" y "Registrarse" solo sin sesión, y "Mi perfil" y "Cerrar sesión" solo con sesión.
- "Panel Admin" aparece únicamente para el rol **ADMIN**. Si alguien llega al panel sin sesión o sin ese rol, ve una pantalla de acceso restringido.
- El carrito exige sesión: sin sesión, "Agregar" lleva al login.
- El backend vuelve a verificar cada permiso (401/403), así que la restricción no depende solo del navegador.

| Rol | Correo | Contraseña |
|---|---|---|
| ADMIN | admin@losmaestros.cl | Admin123 |
| CLIENTE | cliente@losmaestros.cl | Cliente123 |

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
