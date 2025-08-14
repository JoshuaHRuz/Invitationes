import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContentBlock {
  id: number;
  page: string;
  blockType: string;
  title?: string;
  subtitle?: string;
  contentHtml?: string;
  imageUrl?: string;
  imageSide?: 'left' | 'right';
  dataJson?: string; // JSON para features/faq
  orderIndex?: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/content`;
  private updates$ = new Subject<void>();

  getPage(page: string): Observable<ContentBlock[]> {
    return this.http.get<ContentBlock[]>(`${this.baseUrl}/${page}`);
  }

  create(block: Partial<ContentBlock>): Observable<ContentBlock> {
    return this.http.post<ContentBlock>(this.baseUrl, block);
  }
  update(id: number, block: Partial<ContentBlock>): Observable<ContentBlock> {
    return this.http.put<ContentBlock>(`${this.baseUrl}/${id}`, block);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}



