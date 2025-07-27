import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent {
  events = [
    {
      name: 'Ceremonia',
      location: 'Parroquia del Señor del Calvario',
      address: '15 de Septiembre 45, Culhuacan, Iztapalapa, 09800 Ciudad de México, CDMX',
      time: '12:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1882.3486820365415!2d-99.1094656844021!3d19.338934328771078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce01fde9e70707%3A0x1dd1d4dbef37e36d!2sParroquia%20del%20Se%C3%B1or%20del%20Calvario!5e0!3m2!1ses-419!2smx!4v1632863411797!5m2!1ses-419!2smx',
      imageUrl: '/assets/images/photos/church.png', // Reemplazar con imagen real
      imageOrder: 'right', // La imagen irá a la derecha
      dressCode: null
    },
    {
      name: 'Recepción',
      location: 'Hacienda Santa Catarina',
      address: 'Carr a San Bartolomé Xicomulco 579, Santa Cecilia Tepetlapa, Xochimilco, 16880 Ciudad de México, CDMX',
      time: '3:30 PM - 1:00 AM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.646451725729!2d-99.082305285732!3d19.210638352720135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0437dbf21e11%3A0xe76e6e2ab267a3f4!2sHacienda%20Santa%20Catarina!5e0!3m2!1ses-419!2smx!4v1632863818303!5m2!1ses-419!2smx',
      imageUrl: '/assets/images/photos/venue.png', // Reemplazar con imagen real
      imageOrder: 'left', // La imagen irá a la izquierda
      dressCode: {
        title: 'Vestimenta Formal',
        icons: ['/assets/icons/vestido.svg', '/assets/icons/traje.svg']
      }
    }
  ];
} 