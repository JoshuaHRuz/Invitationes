import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderDashboardRoutingModule } from './builder-dashboard-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BuilderLandingComponent } from './builder-landing/builder-landing';
import { InvitationEditorComponent } from './invitation-editor/invitation-editor';

@NgModule({
  declarations: [
    BuilderLandingComponent,
    InvitationEditorComponent
  ],
  imports: [
    CommonModule,
    BuilderDashboardRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ]
})
export class BuilderDashboardModule { } 