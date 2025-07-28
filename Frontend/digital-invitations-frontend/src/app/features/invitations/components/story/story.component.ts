import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDataService } from '../../../../core/services/invitation-data.service';
import { InvitationData } from '../../../../core/models/invitation.model';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit, OnDestroy {
  invitationData!: InvitationData;
  children: InvitationData['story']['children'] = [];

  currentChildIndex = 0;
  currentChildTransform = 0;
  private intervalId: any;

  constructor(private invitationDataService: InvitationDataService) {}

  ngOnInit() {
    this.invitationData = this.invitationDataService.getInvitationData();
    this.children = this.invitationData.story.children;
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel() {
    if (this.children.length > 1) {
      this.intervalId = setInterval(() => {
        this.nextChild();
      }, 5000);
    }
  }

  nextChild() {
    this.currentChildIndex = (this.currentChildIndex + 1) % this.children.length;
    this.updateTransform();
  }

  prevChild() {
    this.currentChildIndex = (this.currentChildIndex - 1 + this.children.length) % this.children.length;
    this.updateTransform();
  }

  updateTransform() {
    this.currentChildTransform = -this.currentChildIndex * 100;
  }
} 