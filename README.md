# ✈️ FlyTrack Web

Frontend de **FlyTrack**, una plataforma de gestión aeroportuaria. Los pasajeros consultan vuelos, reservan itinerarios, registran reclamos de equipaje y reciben notificaciones; los operadores gestionan vuelos y reclamos desde su propio panel.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)
![CI](https://github.com/MiltonGomez775/FrontendVuelos/actions/workflows/ci.yml/badge.svg)

🔗 **Demo:** [frontend-vuelos.vercel.app](https://frontend-vuelos.vercel.app) · **API:** [BackendVuelos](https://github.com/MiltonGomez775/BackendVuelos)

<!-- Agregue aquí una captura: ![FlyTrack](docs/captura.png) -->

---

## Funcionalidades

- Registro e inicio de sesión con JWT.
- **Interceptor HTTP** que adjunta el token a cada petición y **guards** que protegen las rutas según el rol.
- **Panel de pasajero:** reservas, reclamos de equipaje y notificaciones.
- **Panel de operador:** gestión de vuelos y de reclamos.
- Listado público de vuelos disponibles.

## Tecnologías

- Angular 21 (componentes standalone)
- TypeScript, SCSS
- Vitest para pruebas unitarias
- Docker + Nginx para servir la build
- Vercel (con rewrites hacia la API en Railway) y GitHub Actions

## Estructura

```
src/app
├── guards/         # Protección de rutas por rol
├── interceptors/   # Token JWT en las peticiones
├── models/         # Interfaces de dominio
├── pages/          # login, register, flights, passenger-dashboard, operator-dashboard
└── services/       # Comunicación con la API
```

## Cómo ejecutarlo

```bash
npm install
npm start        # http://localhost:4200
```

En desarrollo, `proxy.conf.json` redirige `/api` hacia el backend local (`http://localhost:8080`).

```bash
npm run build    # build de producción
npm test         # pruebas unitarias
```

## CI/CD

Cada push a `main` compila el proyecto en GitHub Actions y, si pasa, lo despliega automáticamente en Vercel.

---

Desarrollado por **[Milton Gómez](https://github.com/MiltonGomez775)**
