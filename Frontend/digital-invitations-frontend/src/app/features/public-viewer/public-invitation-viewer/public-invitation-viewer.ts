import { Component } from '@angular/core';

@Component({
  selector: 'app-public-invitation-viewer',
  standalone: false,
  templateUrl: './public-invitation-viewer.component.html',
  styleUrl: './public-invitation-viewer.scss'
})
export class PublicInvitationViewerComponent {
  invitation: any = {};
}
