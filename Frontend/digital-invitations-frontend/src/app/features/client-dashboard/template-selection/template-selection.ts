import { Component } from '@angular/core';

@Component({
  selector: 'app-template-selection',
  standalone: false,
  templateUrl: './template-selection.component.html',
  styleUrl: './template-selection.scss'
})
export class TemplateSelectionComponent {
  templates: any[] = [];
}
