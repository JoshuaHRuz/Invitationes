import { Component } from '@angular/core';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.scss'
})
export class UserManagementComponent {
  users: any[] = [];

  openAddUserDialog() {
    // Lógica para abrir el diálogo de añadir usuario
    console.log('Abrir diálogo de añadir usuario');
  }
}
