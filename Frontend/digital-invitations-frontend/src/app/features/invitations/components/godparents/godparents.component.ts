import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-godparents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './godparents.component.html',
  styleUrls: ['./godparents.component.scss']
})
export class GodparentsComponent implements OnInit {
  godparents$!: Observable<InvitationData['godparents']>;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.godparents$ = this.invitationDataService.getInvitationData().pipe(
      map(data => data.godparents)
    );
  }
} 