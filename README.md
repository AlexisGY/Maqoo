# Maqoo - App movil de recetas

Aplicacion en React Native (Expo) y backend NestJS + Prisma para encontrar que cocinar segun tu despensa. Incluye reconocimiento de ingredientes con IA y busqueda de tiendas cercanas.

## Requisitos
- Node.js 18-21
- npm
- Cuenta de Google Cloud (Vision y/o Places) opcional
- PostgreSQL para el backend

## Variables de entorno

Raiz (`.env`):
```
EXPO_PUBLIC_API_BASE_URL=http://<host-backend>:3000/api
EXPO_PUBLIC_PLACES_BASE_URL=http://<host-places>:3001
```

Backend (`backend/.env`):
```
DATABASE_URL=postgres://user:password@localhost:5432/maqoo
JWT_SECRET=change-me
PORT=3000
INGREDIENT_AI_PROVIDER=vision            # vision para Google Cloud Vision, vacio para mocks/URL generica
INGREDIENT_AI_KEY=<vision_api_key>       # obligatorio si provider=vision
INGREDIENT_AI_URL=                       # opcional, solo si usas proveedor multipart propio
PLACES_PORT=3001                         # puerto del microservicio de tiendas
PLACES_PROVIDER=google                   # google o nominatim
PLACES_API_KEY=<places_api_key>          # requerido si provider=google
```

Para la app Expo copia `.env.example` a `.env` y ajusta las URLs a tu IP local.

## Como correr en local

Backend solo (puerto 3000):
```
cd backend
npm install
npm run start:dev
```

Backend + microservicio de tiendas (puertos 3000 y 3001):
```
cd backend
npm run start:dev:all
```
o solo tiendas:
```
node server/index.js   # desde la raiz
```

App Expo:
```
npm install
npm start
# o npx expo start -c para refrescar envs
```
Escanea el QR en Expo Go y asegúrate de que la IP en `.env` apunte a tu maquina.

## Funcionalidades clave
- Escaneo de ingredientes: `POST /api/ingredients/recognize` (multipart image). Usa Google Vision si `INGREDIENT_AI_PROVIDER=vision`, o responde con mocks sin configuracion.
- Recetas: se siembran recetas base por usuario al primer listado; incluyen ingredientes normalizados e instrucciones.
- Despensa, favoritos y preferencias con JWT.
- Tiendas cercanas: microservicio en `server/index.js` con proveedor Google Places o Nominatim. La app consume `EXPO_PUBLIC_PLACES_BASE_URL`.

## Notas
- Prefijo API del backend: `/api`.
- Las API keys no se deben commitear; usa los `.env.example` como guia.
