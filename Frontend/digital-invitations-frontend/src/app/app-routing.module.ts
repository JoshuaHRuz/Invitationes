import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from './core/services/role.guard';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'invitations', loadChildren: () => import('./features/invitations/invitations.routes').then(m => m.INVITATIONS_ROUTES) },
  { path: 'client-dashboard', canActivate: [roleGuard], data: { roles: ['CLIENT'] }, loadChildren: () => import('./features/client-dashboard/client-dashboard.module').then(m => m.ClientDashboardModule) },
  { path: 'builder-dashboard', canActivate: [roleGuard], data: { roles: ['BUILDER', 'ADMIN'] }, loadChildren: () => import('./features/builder-dashboard/builder-dashboard.module').then(m => m.BuilderDashboardModule) },
  { path: 'admin-dashboard', canActivate: [roleGuard], data: { roles: ['ADMIN'] }, loadChildren: () => import('./features/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule) },
  { path: 'invitation/:slug', loadChildren: () => import('./features/public-viewer/public-viewer.module').then(m => m.PublicViewerModule) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'about', loadComponent: () => import('./features/public-viewer/public-content.component').then(m => m.PublicContentComponent), data: { page: 'about' } },
  { path: 'services', loadComponent: () => import('./features/public-viewer/public-content.component').then(m => m.PublicContentComponent), data: { page: 'services' } },
  { path: 'team', loadComponent: () => import('./features/public-viewer/public-content.component').then(m => m.PublicContentComponent), data: { page: 'team' } },
  { path: 'projects', loadComponent: () => import('./features/public-viewer/public-content.component').then(m => m.PublicContentComponent), data: { page: 'projects' } },
  { path: 'testimonials', loadComponent: () => import('./features/public-viewer/public-content.component').then(m => m.PublicContentComponent), data: { page: 'testimonials' } },
  { path: 'faq', loadComponent: () => import('./features/public-viewer/public-content.component').then(m => m.PublicContentComponent), data: { page: 'faq' } },
  { path: 'pricing', loadComponent: () => import('./features/public-viewer/public-content.component').then(m => m.PublicContentComponent), data: { page: 'pricing' } },
  { path: '**', loadChildren: () => import('./features/invitations/invitations.routes').then(m => m.INVITATIONS_ROUTES) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
