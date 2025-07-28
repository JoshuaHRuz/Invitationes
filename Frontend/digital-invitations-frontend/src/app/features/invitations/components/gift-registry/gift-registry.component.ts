import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gift-registry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift-registry.component.html',
  styleUrls: ['./gift-registry.component.scss']
})
export class GiftRegistryComponent {
  message = "El mejor regalo es tu presencia, pero si deseas obsequiarnos algo más, puedes hacerlo de las siguientes maneras:";

  stores = [
    {
      name: 'Liverpool',
      logoUrl: '/assets/images/logos/liverpool.png',
      link: '#' // Reemplazar con el enlace real
    },
    {
      name: 'Amazon',
      logoUrl: '/assets/images/logos/amazon.png',
      link: '#' // Reemplazar con el enlace real
    }
  ];

  bankAccount = {
    message: "O si prefieres, puedes apoyarnos con un regalo en efectivo:",
    bank: "BBVA",
    accountHolder: "Ana Pérez Ramírez",
    clabe: "1234 5678 9012 345678"
  };
} 