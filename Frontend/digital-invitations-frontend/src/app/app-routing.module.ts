import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'invitations', loadChildren: () => import('./features/invitations/invitations.routes').then(m => m.INVITATIONS_ROUTES) },
  { path: 'client-dashboard', loadChildren: () => import('./features/client-dashboard/client-dashboard.module').then(m => m.ClientDashboardModule) },
  { path: 'builder-dashboard', loadChildren: () => import('./features/builder-dashboard/builder-dashboard.module').then(m => m.BuilderDashboardModule) },
  { path: 'admin-dashboard', loadChildren: () => import('./features/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule) },
  { path: 'invitation/:slug', loadChildren: () => import('./features/public-viewer/public-viewer.module').then(m => m.PublicViewerModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
