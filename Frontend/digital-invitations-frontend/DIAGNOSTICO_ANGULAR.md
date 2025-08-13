## Diagnóstico de arquitectura y mejores prácticas Angular

### Resumen
- **Estado general**: La estructura por capas `core/`, `shared/`, `features/` está bien encaminada. Hay buen uso de lazy loading y configuración estricta de TypeScript/Angular.
- **Riesgos/bugs**: Uso de `styleUrl` en lugar de `styleUrls` en varios componentes; mezcla de rutas con `provideRouter` y `RouterModule.forRoot`; nombres de archivos no estándar (p. ej., `login.ts` en vez de `login.component.ts`).
- **Oportunidades**: Migrar totalmente a standalone con `app.routes.ts`, unificar convención de nombres, tipar `any`, reemplazar flags `0|1` por `boolean`, mover datos hardcodeados a una fuente de datos.

---

### Estructura del proyecto
- **Correcto**:
  - `src/app/core/` para servicios y modelos.
  - `src/app/shared/` para componentes compartidos (p. ej., `navbar`).
  - `src/app/features/` para módulos/funcionalidades (auth, landing, invitations, dashboards, public-viewer).
  - `assets/` y `public/` configurados en `angular.json`.
- **Mejorable**:
  - Carpeta `htmlStructure/` parece prototipos/legacy. Reubicar a `docs/` o eliminarlos si no se usan.

### Configuración Angular/TypeScript
- `tsconfig.json`: strict, strictTemplates, strictInjectionParameters, etc. ✅ Bien.
- `angular.json`: Builder `@angular/build:application`, SCSS, budgets y hashing en prod. ✅ Bien.
- `main.ts`: uso de `bootstrapApplication` con `provideRouter`, `provideHttpClient`, `provideAnimations`. ✅ Bien para standalone.

### Rutas y bootstrap
- **Hallazgo**: `main.ts` usa `provideRouter(routes)` pero existe `AppRoutingModule` con `RouterModule.forRoot(routes)` en `app-routing.module.ts`.
  - Impacto: código duplicado/inerte; puede confundir y generar doble mantenimiento.
  - Recomendación:
    - Renombrar `app-routing.module.ts` a `app.routes.ts` y eliminar el `@NgModule` dejando solo:
```ts
export const routes: Routes = [ /* ... */ ];
```
    - Mantener solo `provideRouter(routes)` en `main.ts`.
- **Fallback route**: `{'**', loadChildren: ...invitations.routes}` redirige siempre a invitaciones.
  - Recomendación: usar una página 404 o redirigir explícitamente a landing.

### Standalone vs NgModule
- El `AppComponent` y varios componentes (`Navbar`, `MusicPlayer`, `Login`, `Register`, `ForgotPassword`, probablemente `LandingComponent`) son standalone; muchos features siguen en `NgModule` (p. ej., `admin-dashboard`, `public-viewer`).
  - Estrategia válida de transición. Aun así, definir una dirección clara:
    - Opción A (recomendada): Migrar features a rutas standalone con `routes.ts` por feature y eliminar `NgModule` donde sea posible.
    - Opción B: Mantener `NgModule` y no usar standalone en esos features (menos recomendado a partir de Angular 17).

### Nomenclatura de archivos y convenciones Angular
- **Problema**: múltiples componentes no siguen el sufijo estándar `*.component.ts` y `*.component.scss`:
  - Ejemplos: `features/auth/login/login.ts`, `features/admin-dashboard/admin-landing/admin-landing.ts`, `features/public-viewer/public-invitation-viewer/public-invitation-viewer.ts`.
  - Impacto: dificulta la búsqueda, tooling, y coherencia.
  - Recomendación: renombrar a `login.component.ts`, `admin-landing.component.ts`, `public-invitation-viewer.component.ts`; alinear también `*.html`/`*.scss` con `.component.*`.

### Bugs y problemas concretos detectados
- Component metadata utiliza `styleUrl` en lugar de `styleUrls`:
  - `features/admin-dashboard/admin-landing/admin-landing.ts`
  - `features/public-viewer/public-invitation-viewer/public-invitation-viewer.ts`
  - Efecto: los estilos no se aplican. Debe ser:
```ts
@Component({
  /* ... */
  styleUrls: ['./admin-landing.scss']
})
```
- Rutas duplicadas/mixtas como se indicó arriba (NgModule + provideRouter).

### Servicios y modelos
- `core/services/invitation-data.service.ts` contiene datos hardcodeados extensos.
  - Recomendación:
    - Extraer a un JSON en `assets/` o consumir desde backend.
    - El servicio debe exponer `Observable<InvitationData>`.
- `PublicInvitationViewerComponent` tipa `invitation: any`.
  - Recomendación: usar `InvitationData` del modelo (`core/models/invitation.model.ts`).
- `ComponentVisibility` usa `0 | 1`. Reemplazar por `boolean` para claridad y evitar comprobaciones numéricas.

### Estilos
- Global `styles.scss` correcto; uso de variables CSS y tipografía.
- Mejora de performance: cargar Google Fonts vía `<link>` en `index.html` en vez de `@import` en SCSS.
- Unificar convención de nombres de estilos a `*.component.scss` por componente.

### Assets y rutas
- Mezcla de rutas con y sin `/` inicial en imágenes/iconos (p. ej., `'/assets/images/photos/venue.jpeg'` vs `'assets/images/...')`.
  - Recomendación: usar rutas relativas `assets/...` para evitar problemas en subrutas y despliegues con base href distinto.

### Accesibilidad y UX (rápido)
- Agregar `alt` descriptivo en todas las imágenes de galería y secciones.
- Asegurar foco y roles ARIA en componentes interactivos (navbar/menu, reproductor de música).

### Testing
- Hay algunos `*.spec.ts` en auth. Recomendación: añadir pruebas mínimas para servicios (`MusicService`, `InvitationDataService`) y rutas críticas.

### Recomendaciones priorizadas (plan de acción)
1) Corregir `styleUrl` ➜ `styleUrls` en los componentes afectados.
2) Eliminar `AppRoutingModule` y crear `app.routes.ts` consumido por `provideRouter` en `main.ts`.
3) Unificar convención de nombres:
   - `*.component.ts`, `*.component.html`, `*.component.scss`.
   - Actualizar imports en módulos/rutas en consecuencia.
4) Tipar correctamente y mejorar modelos:
   - `any` ➜ `InvitationData` en `PublicInvitationViewerComponent`.
   - `ComponentVisibility` ➜ `boolean`.
5) Normalizar rutas de assets a `assets/...` (sin `/` inicial).
6) Extraer datos de invitación a `assets/data/invitation.json` o integrar backend; servicio devuelve `Observable<InvitationData>`.
7) Opcional: migrar features a rutas standalone y eliminar `NgModule` gradualmente.
8) Cargar fuentes con `<link>` en `index.html`.

### Ejemplos concretos de cambios
- `app.routes.ts` (reemplazo de `app-routing.module.ts`):
```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'invitations', loadChildren: () => import('./features/invitations/invitations.routes').then(m => m.INVITATIONS_ROUTES) },
  { path: 'client-dashboard', loadChildren: () => import('./features/client-dashboard/client-dashboard.module').then(m => m.ClientDashboardModule) },
  { path: 'builder-dashboard', loadChildren: () => import('./features/builder-dashboard/builder-dashboard.module').then(m => m.BuilderDashboardModule) },
  { path: 'invitation/:slug', loadChildren: () => import('./features/public-viewer/public-viewer.module').then(m => m.PublicViewerModule) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', redirectTo: '' }
];
```

- Corrección de metadata (ejemplo `admin-landing.component.ts`):
```ts
@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.scss']
})
```

- Tipado en `PublicInvitationViewerComponent`:
```ts
import { InvitationData } from '../../../core/models/invitation.model';

export class PublicInvitationViewerComponent {
  invitation: InvitationData | null = null;
}
```

- Modelo `ComponentVisibility` con boolean:
```ts
export interface ComponentVisibility {
  welcomeScreen: boolean;
  musicPlayer: boolean;
  // ...
}
```

---

### Conclusión
La base es sólida y moderna (builder v17, standalone en raíz, lazy loading). Para alcanzar un nivel de excelencia, enfocar en: coherencia de nomenclatura, eliminación de duplicidades de routing, correcciones de metadata (`styleUrls`), tipado fuerte y desacoplar datos estáticos. Con estos ajustes, el código será más mantenible, predecible y listo para crecer.


