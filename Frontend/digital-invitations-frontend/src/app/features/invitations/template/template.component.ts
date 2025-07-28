import { Component, OnInit } from '@angular/core';
import { InvitationDataService } from '../../../core/services/invitation-data.service';
import { ComponentVisibility } from '../../../core/models/invitation.model';
import { CommonModule } from '@angular/common';
import { WelcomeScreenComponent } from '../components/welcome-screen/welcome-screen.component';
import { MusicPlayerComponent } from '../components/music-player/music-player.component';
import { StoryComponent } from '../components/story/story.component';
import { CountdownComponent } from '../components/countdown/countdown.component';
import { GodparentsComponent } from '../components/godparents/godparents.component';
import { EventDetailsComponent } from '../components/event-details/event-details.component';
import { PhotoGalleryComponent } from '../components/photo-gallery/photo-gallery.component';
import { GiftRegistryComponent } from '../components/gift-registry/gift-registry.component';
import { ItineraryComponent } from '../components/itinerary/itinerary.component';
import { RsvpFormComponent } from '../components/rsvp-form/rsvp-form.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeScreenComponent,
    MusicPlayerComponent,
    StoryComponent,
    CountdownComponent,
    GodparentsComponent,
    EventDetailsComponent,
    PhotoGalleryComponent,
    GiftRegistryComponent,
    ItineraryComponent,
    RsvpFormComponent,
    FooterComponent
  ],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  visibility?: ComponentVisibility;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit(): void {
    this.visibility = this.invitationDataService.getInvitationData().componentVisibility;
  }
} 