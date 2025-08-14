import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingService, LandingSlide, LandingSection } from '../../../core/services/landing.service';
import { ToastService } from '../../../shared/components/toast/toast.component';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-landing-cms',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, NavbarComponent],
  templateUrl: './landing-cms.component.html',
  styleUrls: ['./landing-cms.component.scss']
})
export class LandingCmsComponent implements OnInit {
  slides: LandingSlide[] = [];
  sections: LandingSection[] = [];

  newSlide: Partial<LandingSlide> = { title: '', subtitle: '', backgroundColor: '#4a148c', orderIndex: 0, active: true, overlayEnabled: true, overlayOpacity: 0.35 };
  newSection: Partial<LandingSection> = { title: '', contentHtml: '', orderIndex: 0, active: true };

  constructor(private landingService: LandingService, private toast: ToastService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.landingService.getSlides().subscribe(s => this.slides = s);
    this.landingService.getSections().subscribe(s => this.sections = s);
  }

  createSlide(): void {
    this.landingService.createSlide(this.newSlide).subscribe(() => {
      this.newSlide = { title: '', subtitle: '', backgroundColor: '#4a148c', orderIndex: 0, active: true, overlayEnabled: true, overlayOpacity: 0.35 };
      this.reload();
      this.toast.show('Slide agregado', 'success');
    });
  }

  updateSlide(slide: LandingSlide): void {
    this.landingService.updateSlide(slide.id, slide).subscribe(() => { this.reload(); this.toast.show('Slide guardado', 'success'); });
  }

  deleteSlide(id: number): void {
    this.landingService.deleteSlide(id).subscribe(() => { this.reload(); this.toast.show('Slide eliminado', 'success'); });
  }

  createSection(): void {
    this.landingService.createSection(this.newSection).subscribe(() => {
      this.newSection = { title: '', contentHtml: '', orderIndex: 0, active: true };
      this.reload();
      this.toast.show('Sección agregada', 'success');
    });
  }

  updateSection(section: LandingSection): void {
    this.landingService.updateSection(section.id, section).subscribe(() => { this.reload(); this.toast.show('Sección guardada', 'success'); });
  }

  deleteSection(id: number): void {
    this.landingService.deleteSection(id).subscribe(() => { this.reload(); this.toast.show('Sección eliminada', 'success'); });
  }

  onSlideFile(evt: Event, model?: LandingSlide): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.landingService.upload(file).subscribe(url => {
      if (model) {
        model.imageUrl = url;
        // guardado automático
        this.updateSlide(model);
        this.toast.show('Imagen de slide actualizada', 'success');
      } else {
        this.newSlide.imageUrl = url;
        this.toast.show('Imagen cargada', 'success');
      }
    });
    input.value = '';
  }

  onSectionFile(evt: Event, model?: LandingSection): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.landingService.upload(file).subscribe(url => {
      if (model) {
        model.imageUrl = url;
        // guardado automático
        this.updateSection(model);
        this.toast.show('Imagen de sección actualizada', 'success');
      } else {
        this.newSection.imageUrl = url;
        this.toast.show('Imagen cargada', 'success');
      }
    });
    input.value = '';
  }

  onSlidesReorder(event: CdkDragDrop<LandingSlide[]>): void {
    if (!event || event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.slides, event.previousIndex, event.currentIndex);
    // Normalizar orderIndex consecutivo y persistir en backend
    this.slides.forEach((s, idx) => s.orderIndex = idx + 1);
    // Guardado en lote simple (secuencial)
    this.slides.forEach(s => this.landingService.updateSlide(s.id, s).subscribe());
  }

  onSectionsReorder(event: CdkDragDrop<LandingSection[]>): void {
    if (!event || event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    this.sections.forEach((s, idx) => s.orderIndex = idx + 1);
    this.sections.forEach(s => this.landingService.updateSection(s.id, s).subscribe());
  }
}


