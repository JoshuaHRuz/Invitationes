import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicInvitationViewerComponent } from './public-invitation-viewer/public-invitation-viewer';

const routes: Routes = [
  { path: '', component: PublicInvitationViewerComponent }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicViewerRoutingModule { } 