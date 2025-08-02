import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit {
  photos!: InvitationData['photoGallery'];
  invitationData!: InvitationData;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.invitationData = this.invitationDataService.getInvitationData();
    this.photos = this.invitationData.photoGallery;
  }
} 