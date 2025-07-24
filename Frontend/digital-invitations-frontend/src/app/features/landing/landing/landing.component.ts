import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  slides = [
    { color: '#4a148c', text: 'Diseños Elegantes y Modernos' }, // A deep, rich purple
    { color: '#880e4f', text: 'Personalización al Instante' }, // A sophisticated, deep pink
    { color: '#6a1b9a', text: 'Confirma Asistencia Fácilmente' } // Our primary purple, for consistency
  ];
  currentSlide = 0;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000); // Change slide every 5 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
} 