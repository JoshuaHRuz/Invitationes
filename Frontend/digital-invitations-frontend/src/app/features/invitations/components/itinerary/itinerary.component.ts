import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {
  timeline!: InvitationData['itinerary'];

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.timeline = this.invitationDataService.getInvitationData().itinerary;
  }
} 