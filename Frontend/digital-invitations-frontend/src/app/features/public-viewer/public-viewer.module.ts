import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicViewerRoutingModule } from './public-viewer-routing.module';
import { PublicInvitationViewerComponent } from './public-invitation-viewer/public-invitation-viewer';
import { RsvpFormComponent } from './rsvp-form/rsvp-form';
import { MessageBoardComponent } from './message-board/message-board';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PublicViewerRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatListModule,
    FormsModule
  ],
  declarations: [
    PublicInvitationViewerComponent,
    RsvpFormComponent,
    MessageBoardComponent
  ]
})
export class PublicViewerModule { } 