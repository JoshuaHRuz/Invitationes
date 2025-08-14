import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLandingComponent } from './admin-landing/admin-landing';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { UserManagementComponent } from './user-management/user-management';
import { TemplateManagementComponent } from './template-management/template-management';
import { StatisticsComponent } from './statistics/statistics';
import { LandingCmsComponent } from './landing-cms/landing-cms.component';
import { ContentCmsComponent } from './content-cms/content-cms.component';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { PagesCmsComponent } from './pages-cms/pages-cms.component';

const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', component: AdminLandingComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'templates', component: TemplateManagementComponent },
      { path: 'landing-cms', component: LandingCmsComponent },
      { path: 'content', component: ContentCmsComponent },
      { path: 'pages', component: PagesCmsComponent },
      { path: 'theme', component: ThemeSettingsComponent },
      { path: 'stats', component: StatisticsComponent }
    ]
  }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { } 