# Roadmap: Admin CMS, Páginas y Normalización

Este documento resume el estado actual y los siguientes pasos para continuar del lado del ADMIN y el render público.

## Estado actual
- Roles, guards y rutas protegidas por rol.
- Landing CMS (slides + secciones) con upload, drag-and-drop y SSE (actualización en vivo).
- Theme global dinámico: colores, tipografías (Google Fonts), tamaño base, color de títulos y texto de botón.
- Navbar dinámico: enlaces generados a partir de `PageSetting.enabled` en backend; SSE para cambios.
- Contenido genérico por páginas (About/Services/Team/Projects/Testimonials/FAQ/Pricing): API `ContentBlock`, CMS para CRUD, render público base (`hero`, `textImage`).

## Pendiente inmediato
1) CMS de PageSetting (UI completa)
   - Ruta: `/admin-dashboard/pages` (ya registrada)
   - Funcionalidad: crear/editar/eliminar, reordenar (drag-and-drop), habilitar/deshabilitar, editar `menuTitle`.
   - Navbar ya escucha SSE y se actualiza.

2) Render público avanzado de `ContentBlock`
   - Soportar `features` (grid de 3xN) con `dataJson` como array de `{ icon, title, description }`.
   - Soportar `faq` (acordeón) con `dataJson` como array de `{ question, answer }`.
   - CTA: botón(es) con enlaces.

3) CMS de `features` y `faq`
   - UI para editar `dataJson` con formularios dinámicos y validación mínima.
   - Previsualización simple en el CMS.

4) Normalización de componentes (excluyendo `features/invitations/`)
   - Migrar colores y fuentes hardcodeadas a variables CSS globales (`--color-*`, `--font-*`).
   - Revisar `auth/`, `builder-dashboard/`, `client-dashboard/`, `admin-dashboard/` para consistencia.

5) UX/UI
   - Tabset en un “Admin CMS” unificado con pestañas: Landing | Contenido | Páginas | Estilos.
   - Toasts y spinners en todas las operaciones.
   - Validaciones en formularios.

6) SEO/Meta
   - API `PageMeta` para `title`, `description`, `og:image` por página.
   - Componente `MetaService` en frontend para aplicar meta tags.

## Ideas futuras
- Media manager (listar/borrar/reutilizar imágenes).
- Versionado/histórico de cambios (draft/publish).
- Multilenguaje para `ContentBlock`.
- Permisos granulares (editores por sección/página).

## Notas técnicas
- SSE: `/api/events/updates` emite `landing`, `theme`, `content`, `pages`.
- Backends añadidos: `ThemeSettings`, `ContentBlock`, `PageSetting` y sus migraciones.
- Frontends añadidos: `ThemeService`, `ContentService`, `PagesService`, `ContentCmsComponent`, `PagesCmsComponent`, `PublicContentComponent`.
- Normalización: usar variables CSS globales y evitar colores hardcodeados en nuevos componentes.

## Cómo continuar (sugerido)
1. Implementar UI de `features`/`faq` en CMS y su render público.
2. Añadir “Gestión de Páginas” al landing de Admin (link ya agregado en ruteo; falta card en UI si se desea).
3. Normalizar componentes restantes.
4. Añadir MetaService + PageMeta (API).
