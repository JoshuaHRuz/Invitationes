import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit {
  photos$!: Observable<InvitationData['photoGallery']>;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.photos$ = this.invitationDataService.getInvitationData().pipe(
      map(data => data.photoGallery)
    );
  }
} 