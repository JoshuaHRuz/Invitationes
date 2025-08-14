import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ContentService, ContentBlock } from '../../core/services/content.service';

@Component({
  selector: 'app-public-content',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container" style="margin-top:100px;">
    <section *ngFor="let b of blocks" class="block" [class.reverse]="b.imageSide==='left'">
      <ng-container [ngSwitch]="b.blockType">
        <div *ngSwitchCase="'textImage'" class="grid">
          <div class="text">
            <h2>{{ b.title }}</h2>
            <h3 *ngIf="b.subtitle">{{ b.subtitle }}</h3>
            <div [innerHTML]="b.contentHtml"></div>
          </div>
          <div class="media" *ngIf="b.imageUrl"><img [src]="b.imageUrl"></div>
        </div>
        <div *ngSwitchCase="'features'" class="features">
          <h2>{{ b.title }}</h2>
          <p *ngIf="b.subtitle">{{ b.subtitle }}</p>
          <div class="features-grid">
            <div class="feature" *ngFor="let f of parseArray(b.dataJson)">
              <img *ngIf="f.icon" [src]="f.icon" alt="icon"/>
              <h3>{{ f.title }}</h3>
              <p>{{ f.description }}</p>
            </div>
          </div>
        </div>
        <div *ngSwitchCase="'faq'" class="faq">
          <h2>{{ b.title }}</h2>
          <div class="faq-list">
            <details *ngFor="let q of parseArray(b.dataJson)">
              <summary>{{ q.question }}</summary>
              <div [innerHTML]="q.answer"></div>
            </details>
          </div>
        </div>
        <div *ngSwitchCase="'hero'" class="hero">
          <h1>{{ b.title }}</h1>
          <p>{{ b.subtitle }}</p>
        </div>
        <div *ngSwitchDefault>
          <h2>{{ b.title }}</h2>
          <div [innerHTML]="b.contentHtml"></div>
        </div>
      </ng-container>
    </section>
  </div>
  `,
  styles: [
    `.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;min-height:60vh}`,
    `.reverse .grid{grid-template-areas:'media text'}`,
    `.reverse .text{order:2}`,
    `.reverse .media{order:1}`,
    `.media img{width:100%;height:auto;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.08)}`,
    `.hero{text-align:center;padding:60px 0}`,
    `.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}`,
    `.feature{background:var(--color-surface);border:1px solid #e5e7eb;border-radius:12px;padding:12px;text-align:center}`,
    `.feature img{width:48px;height:48px;object-fit:contain}`,
    `.faq-list details{background:var(--color-surface);border:1px solid #e5e7eb;border-radius:8px;margin:8px 0;padding:8px}`
  ]
})
export class PublicContentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);

  blocks: ContentBlock[] = [];

  ngOnInit(): void {
    const page = this.route.snapshot.data['page'] as string;
    this.content.getPage(page).subscribe(b => this.blocks = b);
  }

  parseArray(json?: string): any[] {
    try { return json ? JSON.parse(json) : []; } catch { return []; }
  }
}


