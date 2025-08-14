import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ThemeSettings {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  primaryFont: string;
  headingsFont: string;
  baseFontSize: string;
  headingsTextColor?: string | null;
  buttonPrimaryTextColor?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/theme`;

  get(): Observable<ThemeSettings> {
    return this.http.get<ThemeSettings>(this.baseUrl).pipe(
      tap((t) => this.applyToDocument(t))
    );
  }

  update(settings: Partial<ThemeSettings>): Observable<ThemeSettings> {
    return this.http.put<ThemeSettings>(this.baseUrl, settings).pipe(
      tap((t) => this.applyToDocument(t))
    );
  }

  connectToUpdates(): void {
    const base = environment.apiUrl.replace('/api','');
    const es = new EventSource(`${base}/api/events/updates`, { withCredentials: true } as any);
    es.addEventListener('theme', () => { this.get().subscribe(); });
  }

  applyToDocument(theme: ThemeSettings): void {
    const r = document.documentElement.style;
    r.setProperty('--color-primary', theme.primaryColor);
    r.setProperty('--color-secondary', theme.secondaryColor);
    r.setProperty('--color-bg', theme.backgroundColor);
    r.setProperty('--color-text', theme.textColor);
    r.setProperty('--font-primary', theme.primaryFont);
    r.setProperty('--font-headings', theme.headingsFont);
    r.setProperty('--font-size-base', theme.baseFontSize);
    r.setProperty('--color-headings-text', theme.headingsTextColor || theme.primaryColor);
    r.setProperty('--color-button-primary-text', theme.buttonPrimaryTextColor || '#ffffff');
    document.body.style.fontFamily = `var(--font-primary), sans-serif`;
    document.documentElement.style.fontSize = theme.baseFontSize || '16px';

    // Cargar dinámicamente fuentes de Google si aplica
    this.ensureGoogleFont('primary-font-link', theme.primaryFont);
    this.ensureGoogleFont('headings-font-link', theme.headingsFont);
  }

  // Aplica cambios en vivo sin persistir
  preview(partial: Partial<ThemeSettings>): void {
    const r = document.documentElement.style;
    if (partial.primaryColor) r.setProperty('--color-primary', partial.primaryColor);
    if (partial.secondaryColor) r.setProperty('--color-secondary', partial.secondaryColor);
    if (partial.backgroundColor) r.setProperty('--color-bg', partial.backgroundColor);
    if (partial.textColor) r.setProperty('--color-text', partial.textColor);
    if (partial.headingsTextColor !== undefined) r.setProperty('--color-headings-text', partial.headingsTextColor || (partial.primaryColor ?? getComputedStyle(document.documentElement).getPropertyValue('--color-primary')));
    if (partial.buttonPrimaryTextColor !== undefined) r.setProperty('--color-button-primary-text', partial.buttonPrimaryTextColor || '#ffffff');
    if (partial.primaryFont) {
      r.setProperty('--font-primary', partial.primaryFont);
      this.ensureGoogleFont('primary-font-link', partial.primaryFont);
      document.body.style.fontFamily = `var(--font-primary), sans-serif`;
    }
    if (partial.headingsFont) {
      r.setProperty('--font-headings', partial.headingsFont);
      this.ensureGoogleFont('headings-font-link', partial.headingsFont);
    }
    if (partial.baseFontSize) {
      r.setProperty('--font-size-base', partial.baseFontSize);
      document.documentElement.style.fontSize = partial.baseFontSize;
    }
  }

  private ensureGoogleFont(linkId: string, family: string | undefined): void {
    if (!family) { return; }
    const familyParam = encodeURIComponent(family.trim()).replace(/%20/g, '+');
    const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@300;400;500;600;700&display=swap`;
    let el = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.id = linkId;
      el.rel = 'stylesheet';
      document.head.appendChild(el);
    }
    if (el.href !== href) {
      el.href = href;
    }
  }
}


