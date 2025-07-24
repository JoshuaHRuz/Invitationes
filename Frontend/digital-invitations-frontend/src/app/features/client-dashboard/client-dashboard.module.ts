import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDashboardRoutingModule } from './client-dashboard-routing.module';
import { TemplateSelectionComponent } from './template-selection/template-selection';
import { InvitationFormComponent } from './invitation-form/invitation-form';
import { PaymentIntegrationComponent } from './payment-integration/payment-integration';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TemplateSelectionComponent,
    InvitationFormComponent,
    PaymentIntegrationComponent
  ],
  imports: [
    CommonModule,
    ClientDashboardRoutingModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    FormsModule
  ]
})
export class ClientDashboardModule { } 