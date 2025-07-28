import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WelcomeScreenComponent implements OnInit {
  @Output() opened = new EventEmitter<void>();
  isWelcomeScreenVisible = true;
  invitationData?: InvitationData;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.invitationData = this.invitationDataService.getInvitationData();
  }

  openInvitation(): void {
    this.isWelcomeScreenVisible = false;
    this.opened.emit();
  }
} 