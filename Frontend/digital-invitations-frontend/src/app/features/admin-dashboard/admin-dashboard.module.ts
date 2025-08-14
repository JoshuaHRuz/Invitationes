import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminLandingComponent } from './admin-landing/admin-landing';
import { UserManagementComponent } from './user-management/user-management';
import { TemplateManagementComponent } from './template-management/template-management';
import { StatisticsComponent } from './statistics/statistics';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LandingCmsComponent } from './landing-cms/landing-cms.component';

@NgModule({
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule
  ],
  declarations: [
    AdminLandingComponent,
    UserManagementComponent,
    TemplateManagementComponent,
    StatisticsComponent,
    
  ]
})
export class AdminDashboardModule { } 