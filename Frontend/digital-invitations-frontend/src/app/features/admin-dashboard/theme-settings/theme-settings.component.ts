import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeSettings } from '../../../core/services/theme.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss']
})
export class ThemeSettingsComponent implements OnInit {
  theme?: ThemeSettings;
  saving = false;
  message = '';
  fontOptions = [
    'Poppins', 'Inter', 'Roboto', 'Montserrat', 'Source Sans 3',
    'Playfair Display', 'Lora', 'Merriweather', 'Nunito', 'Oswald'
  ];
  baseSizeOptions = ['14px', '15px', '16px', '17px', '18px'];

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.get().subscribe(t => this.theme = t);
  }

  save(): void {
    if (!this.theme) return;
    this.saving = true;
    this.themeService.update(this.theme).subscribe(t => {
      this.theme = t;
      this.saving = false;
      this.message = 'Estilos guardados correctamente';
      setTimeout(() => this.message = '', 2000);
    });
  }

  // Preview instantáneo al cambiar selectores
  onChange(): void {
    if (!this.theme) return;
    this.themeService.preview(this.theme);
  }
}


