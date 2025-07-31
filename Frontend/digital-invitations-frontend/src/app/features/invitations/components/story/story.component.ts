import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  isDesktop = false;

  constructor(private invitationDataService: InvitationDataService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.invitationData = this.invitationDataService.getInvitationData();
    this.children = this.invitationData.story.children;
    this.checkScreenSize();
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 992;
    this.currentChildIndex = 0; // Reset index on resize
    this.updateTransform();
  }

  startCarousel() {
    if (this.children.length > (this.isDesktop ? 2 : 1)) {
    this.intervalId = setInterval(() => {
      this.nextChild();
      }, 5000);
    }
  }

  nextChild() {
    const maxIndex = this.isDesktop ? this.children.length - 2 : this.children.length - 1;
    if (this.currentChildIndex < maxIndex) {
      this.currentChildIndex++;
    } else {
      this.currentChildIndex = 0;
    }
    this.updateTransform();
  }

  prevChild() {
    if (this.currentChildIndex > 0) {
      this.currentChildIndex--;
    } else {
      this.currentChildIndex = this.isDesktop ? this.children.length - 2 : this.children.length - 1;
    }
    this.updateTransform();
  }

  updateTransform() {
    const step = this.isDesktop ? 50 : 100;
    this.currentChildTransform = -this.currentChildIndex * step;
  }
} 