import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LandingSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  backgroundColor: string | null;
  orderIndex: number | null;
  active: boolean;
  overlayEnabled?: boolean;
  overlayOpacity?: number; // 0..1
}

export interface LandingSection {
  id: number;
  title: string;
  contentHtml: string;
  imageUrl: string | null;
  imageSide?: 'left' | 'right' | null;
  orderIndex: number | null;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class LandingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/landing`;
  private sseConnected = false;
  private update$ = new Subject<void>();
  private readonly adminUrl = `${environment.apiUrl}/admin`;

  getSlides(): Observable<LandingSlide[]> {
    return this.http.get<LandingSlide[]>(`${this.baseUrl}/slides`);
  }

  getSections(): Observable<LandingSection[]> {
    return this.http.get<LandingSection[]>(`${this.baseUrl}/sections`);
  }

  // Suscripción a eventos para refrescar automáticamente
  connectToUpdates(): Observable<void> {
    if (this.sseConnected) return this.update$.asObservable();
    this.sseConnected = true;
    const url = `${environment.apiUrl.replace('/api','')}/api/events/updates`;
    const es = new EventSource(url, { withCredentials: true } as any);
    es.addEventListener('landing', () => this.update$.next());
    es.addEventListener('theme', () => this.update$.next());
    es.addEventListener('error', () => {/* noop */});
    return this.update$.asObservable();
  }

  // Admin endpoints
  createSlide(payload: Partial<LandingSlide>): Observable<LandingSlide> {
    return this.http.post<LandingSlide>(`${this.baseUrl}/slides`, payload);
  }
  updateSlide(id: number, payload: Partial<LandingSlide>): Observable<LandingSlide> {
    return this.http.put<LandingSlide>(`${this.baseUrl}/slides/${id}`, payload);
  }
  deleteSlide(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/slides/${id}`);
  }

  createSection(payload: Partial<LandingSection>): Observable<LandingSection> {
    return this.http.post<LandingSection>(`${this.baseUrl}/sections`, payload);
  }
  updateSection(id: number, payload: Partial<LandingSection>): Observable<LandingSection> {
    return this.http.put<LandingSection>(`${this.baseUrl}/sections/${id}`, payload);
  }
  deleteSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sections/${id}`);
  }

  // Upload helper (ADMIN)
  upload(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.adminUrl}/upload`, form, { responseType: 'text' }) as unknown as Observable<string>;
  }
}


