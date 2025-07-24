import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-landing',
  standalone: false,
  templateUrl: './admin-landing.component.html',
  styleUrl: './admin-landing.scss'
})
export class AdminLandingComponent {
  currentProjects: any[] = [];
  pastProjects: any[] = [];
  pendingProjects: any[] = [];
}
