# Notas de cambios para despliegue (Landing CMS, Roles y Guards)

## Backend (Spring Boot)

- Seguridad (roles):
  - `SecurityConfig`: GET público para `/api/landing/**`. CRUD `/api/landing/**` y `/api/admin/**` requieren `ROLE_ADMIN`.
  - `CustomUserDetailsService`: agrega `ROLE_*` como authorities.
  - `AuthController`: el JWT incluye claim `role` y responde el rol real.
  - `User`/`Role`: nuevo enum `Role` y campo `role` (default CLIENT).
- JWT:
  - `JwtUtil`: agrega claim `role` y extracción de rol.
- Migraciones Flyway:
  - `V2__Add_role_to_user.sql`: añade columna `role` a tabla `user` y setea ADMIN para `admin@invitationes.com`.
  - `V3__Landing_content.sql`: crea tablas `landing_slide` y `landing_section`, con seed inicial.
- Landing CMS API:
  - Modelos: `LandingSlide`, `LandingSection`.
  - Repos: `LandingSlideRepository`, `LandingSectionRepository`.
  - Controlador: `LandingController` con endpoints:
    - Público: `GET /api/landing/slides`, `GET /api/landing/sections`.
    - Admin: `POST/PUT/DELETE` para slides y secciones.
  - Subidas: `UploadController` `POST /api/admin/upload` (guarda en `static/uploads/` y retorna URL pública `/uploads/<file>`).

## Frontend (Angular)

- Autenticación/roles:
  - `roleGuard`: protege rutas por roles.
  - `app-routing.module.ts`: `client-dashboard` (CLIENT), `builder-dashboard` (BUILDER/ADMIN), `admin-dashboard` (ADMIN).
  - `AuthService`: helpers `getRole()` e `isLoggedIn()` y almacenamiento de `role`.
- Landing dinámica:
  - `LandingService`: consume `GET /api/landing` y CRUD admin + `upload` para imágenes.
  - `LandingComponent`: ahora lee `slides` y `sections` de API. Carrusel con `imageUrl` o `backgroundColor`. Secciones con `contentHtml` y `imageUrl`.
- CMS de Landing (ADMIN):
  - `LandingCmsComponent` (standalone) en `admin-dashboard/landing-cms` con CRUD de slides y secciones, y subida de imágenes.
  - `AdminLanding` añade acceso rápido al CMS.
  - Navbar muestra “Editar landing” en la página raíz si `role==='ADMIN'`.

## Pasos de build y despliegue

1) Backend
- Variables requeridas: `jwt.secret`, `jwt.expiration` (ms). Opcional: `uploads.dir` (default `uploads`).
- Build: `cd Backend/invitationes-backend && ./mvnw -DskipTests clean package`
- Arranque: `java -jar target/invitationes-backend-*.jar`
- Flyway aplicará `V1`, `V2` y `V3` automáticamente.

2) Frontend
- Requiere Node >= 20.19 (o 22.12 recomendado). Actualiza si es necesario.
- Build: `cd Frontend/digital-invitations-frontend && npm ci && npm run build`
- Configura `environment.ts` con `apiUrl` hacia el backend.

## URLs
- Landing pública: `/` (consumo de API para carrusel y secciones).
- CMS Admin: `/admin-dashboard/landing-cms` (necesita sesión con rol ADMIN).
- API público: `GET /api/landing/slides`, `GET /api/landing/sections`.
- API admin: `POST/PUT/DELETE /api/landing/{slides|sections}`, `POST /api/admin/upload`.

## Consideraciones de seguridad
- `contentHtml` se inyecta con `innerHTML`. Validar/sanitizar contenido en el CMS si se requiere política más estricta.
- Los endpoints de escritura requieren `Authorization: Bearer <token>` y rol `ADMIN`.

## Tareas opcionales futuras
- WYSIWYG (ej. Quill/Tiptap) para `contentHtml`.
- Reordenamiento drag-and-drop para `orderIndex`.
- CDN o almacenamiento externo para imágenes.
- Auditoría de cambios (created/updated_by).

