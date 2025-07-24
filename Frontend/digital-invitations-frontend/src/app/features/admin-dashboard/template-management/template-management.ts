import { Component } from '@angular/core';

@Component({
  selector: 'app-template-management',
  standalone: false,
  templateUrl: './template-management.component.html',
  styleUrl: './template-management.scss'
})
export class TemplateManagementComponent {
  templates: any[] = [];

  openAddTemplateDialog() {
    // Lógica para abrir el diálogo de añadir plantilla
    console.log('Abrir diálogo de añadir plantilla');
  }
}
