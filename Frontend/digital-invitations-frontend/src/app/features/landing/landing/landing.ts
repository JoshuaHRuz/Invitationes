import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  slides = [
    { color: '#ff7e5f', text: 'Invitaciones para Bodas' },
    { color: '#feb47b', text: 'Fiestas de Cumpleaños' },
    { color: '#2ab7ca', text: 'Eventos Corporativos' },
    { color: '#8e44ad', text: 'Graduaciones y Aniversarios' }
  ];

  currentSlide = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000); // Cambia cada 5 segundos
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
