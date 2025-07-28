import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-gift-registry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift-registry.component.html',
  styleUrls: ['./gift-registry.component.scss']
})
export class GiftRegistryComponent implements OnInit {
  giftRegistry$!: Observable<InvitationData['giftRegistry']>;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.giftRegistry$ = this.invitationDataService.getInvitationData().pipe(
      map(data => data.giftRegistry)
    );
  }
} 