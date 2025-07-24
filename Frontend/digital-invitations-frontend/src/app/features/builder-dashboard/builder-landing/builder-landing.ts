import { Component } from '@angular/core';

@Component({
  selector: 'app-builder-landing',
  standalone: false,
  templateUrl: './builder-landing.component.html',
  styleUrl: './builder-landing.scss'
})
export class BuilderLandingComponent {
  currentProjects: any[] = [];
  pastProjects: any[] = [];
  pendingProjects: any[] = [];
}
