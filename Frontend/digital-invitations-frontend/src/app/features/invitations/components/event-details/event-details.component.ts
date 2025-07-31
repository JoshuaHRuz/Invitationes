import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  events!: InvitationData['events'];
  isMobile: boolean = false;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.events = this.invitationDataService.getInvitationData().events;
    this.checkMobile();
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth <= 767;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkMobile();
  }
}
