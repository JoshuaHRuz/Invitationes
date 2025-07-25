import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit, OnDestroy {
  children = [
    { name: 'Luis Manuel Hernández', photo: 'assets/images/photos/son-1.png' },
    { name: 'Paola Horta Rojas', photo: 'assets/images/photos/son-2.png' },
    { name: 'José Alberto Vallejo Aguilar', photo: 'assets/images/photos/son-3.png' }
  ];

  currentChildIndex = 0;
  currentChildTransform = 0;
  private intervalId: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextChild();
    }, 5000); // Cambia cada 5 segundos
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