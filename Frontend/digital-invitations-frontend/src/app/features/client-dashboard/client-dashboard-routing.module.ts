import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateSelectionComponent } from './template-selection/template-selection';
import { InvitationFormComponent } from './invitation-form/invitation-form';
import { PaymentIntegrationComponent } from './payment-integration/payment-integration';

const routes: Routes = [
  { path: '', component: TemplateSelectionComponent },
  { path: 'form', component: InvitationFormComponent },
  { path: 'payment', component: PaymentIntegrationComponent }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientDashboardRoutingModule { }