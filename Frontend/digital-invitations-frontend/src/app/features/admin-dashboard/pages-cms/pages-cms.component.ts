import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PagesService, PageSetting } from '../../../core/services/pages.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ToastService } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-pages-cms',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, NavbarComponent],
  templateUrl: './pages-cms.component.html',
  styleUrls: ['./pages-cms.component.scss']
})
export class PagesCmsComponent implements OnInit {
  pages: PageSetting[] = [];
  newPage: Partial<PageSetting> = { page: '', menuTitle: '', orderIndex: 0, enabled: true };

  constructor(private svc: PagesService, private toast: ToastService) {}

  ngOnInit(): void { this.reload(); }

  reload(): void { this.svc.listAll().subscribe(p => this.pages = p); }

  create(): void {
    if (!this.newPage.page) return;
    this.svc.create(this.newPage).subscribe(() => { this.toast.show('Página creada','success'); this.newPage = { page: '', menuTitle: '', orderIndex: 0, enabled: true }; this.reload(); });
  }

  save(p: PageSetting): void { this.svc.update(p.id, p).subscribe(() => this.toast.show('Página guardada','success')); }
  remove(id: number): void { this.svc.delete(id).subscribe(() => { this.toast.show('Página eliminada','success'); this.reload(); }); }

  reorder(event: CdkDragDrop<PageSetting[]>): void {
    if (!event || event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
    this.pages.forEach((p, idx) => p.orderIndex = idx + 1);
    this.pages.forEach(p => this.save(p));
  }
}



