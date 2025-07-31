import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  phoneNumber = '525513434080';
  message = 'Hola, me gustaría obtener más información para crear mi propia invitación.';
  whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.message)}`;
}
