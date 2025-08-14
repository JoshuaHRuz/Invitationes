import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { PagesService, PageSetting } from '../../../core/services/pages.service';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  isLandingPage$: Observable<boolean>;

  enabledPages: PageSetting[] | null = null;

  constructor(private router: Router, private pages: PagesService) {
    this.isLandingPage$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url),
      map(url => url === '/')
    );

    // Cargar páginas habilitadas y suscribirse a cambios
    this.pages.pages$.subscribe((p: PageSetting[] | null) => this.enabledPages = p);
    this.pages.fetchEnabled();
    this.pages.connectToUpdates();
  }

  get role(): string | null {
    try { return localStorage.getItem('role'); } catch { return null; }
  }
} 