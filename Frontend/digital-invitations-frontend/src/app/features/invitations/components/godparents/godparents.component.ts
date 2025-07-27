import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-godparents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './godparents.component.html',
  styleUrls: ['./godparents.component.scss']
})
export class GodparentsComponent {
  godparents = [
    {
      type: 'Anillos',
      icon: 'assets/icons/anillos.svg',
      names: ['Ana María Marín Román']
    },
    {
      type: 'Fotografía',
      icon: 'assets/icons/camara.svg',
      names: ['Joshua Michael Pasten Juárez']
    },
    {
      type: 'Pastel',
      icon: 'assets/icons/pastel.svg',
      names: ['María Antonieta Pérez Hernández', 'Daniel Vega de la Rosa']
    }
  ];
} 