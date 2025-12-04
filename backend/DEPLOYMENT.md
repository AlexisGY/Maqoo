# Despliegue del servicio gestionado

1. **Variables de entorno requeridas**
   - `DATABASE_URL`: cadena de conexión PostgreSQL.
   - `JWT_SECRET`: secreto para firmar los tokens.
   - `PORT`: puerto de escucha (el proveedor suele inyectarlo).

2. **Proveedor recomendado**
   - Render, Railway o Fly.io con build `npm ci && npm run prisma:generate && npm run build` y start `npm run start`.
   - Configurar el servicio como **web service** con puerto público HTTPS.

3. **Base URLs y cabeceras**
   - Base pública sugerida: `https://api.maqoo.app/api` (ajusta al dominio del proveedor).
   - Cabeceras comunes: `Content-Type: application/json` y `Authorization: Bearer <token>` para endpoints protegidos.

4. **Migraciones y base de datos**
   - Ejecuta `npm run prisma:migrate -- --name init` al crear la base.
   - Usa `npm run prisma:generate` en cada despliegue para actualizar el cliente Prisma.

5. **Salud y observabilidad**
   - Puedes añadir un endpoint `/api/health` si el proveedor lo solicita; el servidor NestJS responde 404 para rutas inexistentes.

## Endpoints clave

- `POST /api/auth/register`: registro y entrega de JWT.
- `POST /api/auth/login`: autenticación y entrega de JWT.
- `GET /api/recipes`: paginación (`page`, `limit`) y filtros (`maxTime`, `healthy`, `economical`).
- `POST /api/recipes`, `PATCH /api/recipes/:id`, `DELETE /api/recipes/:id`.
- `GET /api/pantry`, `POST /api/pantry`, `PATCH /api/pantry/:id`, `DELETE /api/pantry/:id`.
- `GET /api/favorites`, `POST /api/favorites/:recipeId/toggle`.
- `GET /api/preferences`, `PATCH /api/preferences`.

Todos los endpoints (excepto login/registro) requieren token JWT en la cabecera `Authorization`.
