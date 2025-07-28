import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {
  timeline$!: Observable<InvitationData['itinerary']>;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.timeline$ = this.invitationDataService.getInvitationData().pipe(
      map(data => data.itinerary)
    );
  }
} 