import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuilderLandingComponent } from './builder-landing/builder-landing';
import { InvitationEditorComponent } from './invitation-editor/invitation-editor';

const routes: Routes = [
  { path: '', component: BuilderLandingComponent },
  { path: 'edit/:id', component: InvitationEditorComponent }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderDashboardRoutingModule { } 