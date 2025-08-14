import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LandingService, LandingSlide, LandingSection } from '../../../core/services/landing.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  slides: LandingSlide[] = [];
  sections: LandingSection[] = [];
  currentSlide = 0;
  private intervalId: any;

  constructor(private landingService: LandingService) {}

  ngOnInit() {
    this.landingService.getSlides().subscribe((slides) => {
      this.slides = slides;
      if (this.slides.length > 0) {
        this.intervalId = setInterval(() => {
          this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        }, 5000);
      }
    });
    this.landingService.getSections().subscribe((sections) => {
      this.sections = sections;
    });

    // Auto-refresco cuando el admin actualiza landing o tema
    this.landingService.connectToUpdates().subscribe(() => {
      this.landingService.getSlides().subscribe(s => this.slides = s);
      this.landingService.getSections().subscribe(s => this.sections = s);
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getOverlayGradient(slide: LandingSlide): string {
    const opacity = (slide.overlayOpacity ?? 0.35);
    const endOpacity = Math.min(1, opacity + 0.2);
    return `linear-gradient(180deg, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity}) 60%, rgba(0,0,0,${endOpacity}) 100%)`;
  }
} 