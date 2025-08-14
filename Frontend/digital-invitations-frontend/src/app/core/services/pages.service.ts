import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PageSetting {
  id: number; page: string; menuTitle: string; orderIndex: number; enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class PagesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pages`;
  private pagesSubject = new BehaviorSubject<PageSetting[] | null>(null);
  pages$ = this.pagesSubject.asObservable();

  list(): Observable<PageSetting[]> { return this.http.get<PageSetting[]>(this.baseUrl); }
  listAll(): Observable<PageSetting[]> { return this.http.get<PageSetting[]>(`${this.baseUrl}/all`); }
  create(p: Partial<PageSetting>): Observable<PageSetting> { return this.http.post<PageSetting>(this.baseUrl, p); }
  update(id: number, p: Partial<PageSetting>): Observable<PageSetting> { return this.http.put<PageSetting>(`${this.baseUrl}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }

  fetchEnabled(): void {
    this.list().subscribe(p => this.pagesSubject.next(p));
  }

  connectToUpdates(): void {
    const base = environment.apiUrl.replace('/api','');
    const es = new EventSource(`${base}/api/events/updates`, { withCredentials: true } as any);
    es.addEventListener('pages', () => this.fetchEnabled());
  }
}


