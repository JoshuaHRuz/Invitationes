import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ContentBlock, ContentService } from '../../../core/services/content.service';
import { LandingService } from '../../../core/services/landing.service';
import { ToastService } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-content-cms',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, NavbarComponent],
  templateUrl: './content-cms.component.html',
  styleUrls: ['./content-cms.component.scss']
})
export class ContentCmsComponent implements OnInit {
  pages = ['home','about','services','team','projects','testimonials','faq','pricing','contact'];
  blockTypes = ['hero','textImage','features','faq','cta','plainHtml'];

  selectedPage = 'home';
  blocks: ContentBlock[] = [];

  newBlock: Partial<ContentBlock> = {
    page: 'home', blockType: 'hero', title: '', subtitle: '', contentHtml: '', imageSide: 'right', orderIndex: 0, active: true
  };

  constructor(
    private content: ContentService,
    private uploader: LandingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.content.getPage(this.selectedPage).subscribe(b => this.blocks = b);
  }

  onPageChange(): void {
    this.newBlock.page = this.selectedPage;
    this.reload();
  }

  create(): void {
    if (!this.newBlock.page || !this.newBlock.blockType) return;
    this.content.create(this.newBlock).subscribe(() => {
      this.toast.show('Bloque creado','success');
      this.newBlock = { page: this.selectedPage, blockType: 'hero', title: '', subtitle: '', contentHtml: '', imageSide: 'right', orderIndex: 0, active: true };
      this.reload();
    });
  }

  save(b: ContentBlock): void {
    this.content.update(b.id, b).subscribe(() => this.toast.show('Bloque guardado','success'));
  }

  remove(id: number): void {
    this.content.delete(id).subscribe(() => { this.toast.show('Bloque eliminado','success'); this.reload(); });
  }

  // Helpers para FEATURES
  getFeatures(b: ContentBlock): Array<{ icon?: string; title?: string; description?: string; }>{
    try { return b.dataJson ? JSON.parse(b.dataJson) : []; } catch { return []; }
  }
  addFeature(b: ContentBlock): void {
    const items = this.getFeatures(b);
    items.push({ icon: '', title: '', description: '' });
    b.dataJson = JSON.stringify(items);
  }
  removeFeature(b: ContentBlock, idx: number): void {
    const items = this.getFeatures(b);
    items.splice(idx, 1);
    b.dataJson = JSON.stringify(items);
  }
  saveFeatures(b: ContentBlock): void { this.save(b); }

  // Helpers para FAQ
  getFaq(b: ContentBlock): Array<{ question?: string; answer?: string; }>{
    try { return b.dataJson ? JSON.parse(b.dataJson) : []; } catch { return []; }
  }
  addFaq(b: ContentBlock): void {
    const items = this.getFaq(b);
    items.push({ question: '', answer: '' });
    b.dataJson = JSON.stringify(items);
  }
  removeFaq(b: ContentBlock, idx: number): void {
    const items = this.getFaq(b);
    items.splice(idx, 1);
    b.dataJson = JSON.stringify(items);
  }
  saveFaq(b: ContentBlock): void { this.save(b); }

  // Actualizadores para templates
  updateFeatures(b: ContentBlock): void {
    const items = this.getFeatures(b);
    b.dataJson = JSON.stringify(items);
  }
  updateFaq(b: ContentBlock): void {
    const items = this.getFaq(b);
    b.dataJson = JSON.stringify(items);
  }

  onUpload(evt: Event, model?: ContentBlock): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploader.upload(file).subscribe(url => {
      if (model) {
        model.imageUrl = url;
        this.save(model);
      } else {
        this.newBlock.imageUrl = url;
      }
      this.toast.show('Imagen cargada','success');
    });
    input.value = '';
  }

  reorder(event: CdkDragDrop<ContentBlock[]>): void {
    if (!event || event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
    this.blocks.forEach((b, idx) => b.orderIndex = idx + 1);
    this.blocks.forEach(b => this.content.update(b.id, b).subscribe());
  }
}


