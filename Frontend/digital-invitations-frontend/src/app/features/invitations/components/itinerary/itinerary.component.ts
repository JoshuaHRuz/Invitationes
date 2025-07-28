import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent {
  timeline = [
    { time: '12:00', title: 'Ceremonia Religiosa', icon: '/assets/icons/church.png' },
    { time: '15:30', title: 'Recepción y Cóctel', icon: '/assets/icons/drink.png' },
    { time: '16:00', title: 'Sesión de Fotos', icon: '/assets/icons/camera.png' },
    { time: '17:00', title: 'Comida', icon: '/assets/icons/comida.png' },
    { time: '18:00', title: '¡A bailar!', icon: '/assets/icons/music-dance.png' },
    { time: '20:00', title: 'Brindis', icon: '/assets/icons/glass.png' },
    { time: '20:15', title: 'Baile de los Novios', icon: '/assets/icons/dance.png' },
    { time: '21:00', title: 'Corte de Pastel', icon: '/assets/icons/cake.png' },
    { time: '21:20', title: '¡Disfruta la Fiesta!', icon: '/assets/icons/music-dance.png' }
  ];
} 