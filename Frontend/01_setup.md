## 1. Project Initialization

First, ensure you have Angular CLI installed (`npm install -g @angular/cli`).

* **Create New Angular Project:**
    ```bash
    ng new digital-invitations-frontend --style=scss --routing --standalone false
    # Choose 'No' for standalone components for module-based structure as per initial request.
    ```
    * `--style=scss`: Uses SCSS for styling, which is good for custom theming.
    * `--routing`: Sets up basic routing.
    * `--standalone false`: Creates a module-based project, aligning with typical Angular Material setups.
* **Navigate to Project Directory:**
    ```bash
    cd digital-invitations-frontend
    ```

## 2. Add Angular Material

Integrate Angular Material into your project.

* **Add Angular Material:**
    ```bash
    ng add @angular/material
    ```
    * Follow the prompts:
        * Choose a prebuilt theme (e.g., `Indigo/Pink` or `Deep Purple/Amber`). You'll customize it later.
        * Set up global Angular Material typography styles: `Yes`.
        * Include Angular Material's prebuilt CSS for common styles: `Yes`.

## 3. Define Data Models / Interfaces

Create TypeScript interfaces that mirror your Spring Boot backend entities/DTOs. This ensures type safety and consistency. Create a folder `src/app/core/models`.

* **`src/app/core/models/user.model.ts`**
    ```typescript
    export interface User {
      id?: number;
      name: string;
      email: string;
      role: 'ADMIN' | 'BUILDER' | 'CLIENT'; // Matches backend enum
      password?: string; // Optional for display, required for signup/login
    }
    ```

* **`src/app/core/models/template.model.ts`**
    ```typescript
    export interface Template {
      id?: number;
      name: string;
      category?: string;
      previewImageUrl?: string;
    }
    ```

* **`src/app/core/models/invitation.model.ts`**
    ```typescript
    import { User } from './user.model';
    import { Template } from './template.model';

    export interface Invitation {
      id?: number;
      client: User;
      template: Template;
      builder?: User; // Optional, assigned by admin
      slug: string;
      status: 'DRAFT' | 'PENDING_BUILDER_REVIEW' | 'PUBLISHED' | 'ARCHIVED'; // Matches backend enum
      content: string; // JSON string from backend
      createdAt?: string;
      updatedAt?: string;
    }
    ```

* **`src/app/core/models/rsvp.model.ts`**
    ```typescript
    import { Invitation } from './invitation.model';

    export interface Rsvp {
      id?: number;
      invitation: Invitation;
      name: string;
      response: 'YES' | 'NO' | 'MAYBE'; // Matches backend enum
      message?: string;
      createdAt?: string;
    }
    ```

* **`src/app/core/models/auth.model.ts`**
    ```typescript
    export interface LoginRequest {
      email: string;
      password: string;
    }

    export interface SignUpRequest {
      name: string;
      email: string;
      password: string;
    }

    export interface AuthResponse {
      accessToken: string;
      userId: number;
      role: 'ADMIN' | 'BUILDER' | 'CLIENT';
      tokenType: string;
    }
    ```

## 4. Environment Configuration

Configure your backend API URL in the environment files.

* **`src/environments/environment.ts`**
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:8080/api'
    };
    ```

* **`src/environments/environment.prod.ts`**
    ```typescript
    export const environment = {
      production: true,
      apiUrl: '[https://your-production-backend-url.com/api](https://your-production-backend-url.com/api)' // Replace with your production URL
    };
    ```

## 5. Core Services (API Interaction)

Create services to handle HTTP requests to your Spring Boot backend. Create a folder `src/app/core/services`.

* **`src/app/core/services/auth.service.ts`**
    ```typescript
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable, BehaviorSubject } from 'rxjs';
    import { tap } from 'rxjs/operators';
    import { environment } from 'src/environments/environment';
    import { LoginRequest, AuthResponse, SignUpRequest, User } from '../models/auth.model';
    import { Router } from '@angular/router';

    @Injectable({
      providedIn: 'root'
    })
    export class AuthService {
      private apiUrl = `${environment.apiUrl}/auth`;
      private currentUserSubject: BehaviorSubject<User | null>;
      public currentUser: Observable<User | null>;

      constructor(private http: HttpClient, private router: Router) {
        const user = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(user ? JSON.parse(user) : null);
        this.currentUser = this.currentUserSubject.asObservable();
      }

      public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
      }

      login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
          tap(response => {
            const user: User = {
              id: response.userId,
              email: request.email, // Email is part of the request
              role: response.role,
              name: '' // Name might need to be fetched separately or included in AuthResponse
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('accessToken', response.accessToken);
            this.currentUserSubject.next(user);
          })
        );
      }

      signup(request: SignUpRequest): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/signup`, request);
      }

      logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      }

      getToken(): string | null {
        return localStorage.getItem('accessToken');
      }

      isAuthenticated(): boolean {
        return !!this.getToken() && !!this.currentUserValue;
      }

      hasRole(role: 'ADMIN' | 'BUILDER' | 'CLIENT'): boolean {
        return this.currentUserValue?.role === role;
      }
    }
    ```

* **`src/app/core/services/user.service.ts`**
    ```typescript
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { environment } from 'src/environments/environment';
    import { User } from '../models/user.model';

    @Injectable({
      providedIn: 'root'
    })
    export class UserService {
      private apiUrl = `${environment.apiUrl}/users`;

      constructor(private http: HttpClient) { }

      getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
      }

      getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
      }

      createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
      }

      updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
      }

      deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }
    }
    ```

* **`src/app/core/services/template.service.ts`**
    ```typescript
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { environment } from 'src/environments/environment';
    import { Template } from '../models/template.model';

    @Injectable({
      providedIn: 'root'
    })
    export class TemplateService {
      private apiUrl = `${environment.apiUrl}/templates`;

      constructor(private http: HttpClient) { }

      getAllTemplates(): Observable<Template[]> {
        return this.http.get<Template[]>(this.apiUrl);
      }

      getTemplateById(id: number): Observable<Template> {
        return this.http.get<Template>(`${this.apiUrl}/${id}`);
      }

      createTemplate(template: Template): Observable<Template> {
        return this.http.post<Template>(this.apiUrl, template);
      }

      updateTemplate(id: number, template: Template): Observable<Template> {
        return this.http.put<Template>(`${this.apiUrl}/${id}`, template);
      }

      deleteTemplate(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }
    }
    ```

* **`src/app/core/services/invitation.service.ts`**
    ```typescript
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { environment } from 'src/environments/environment';
    import { Invitation } from '../models/invitation.model';
    import { Rsvp } from '../models/rsvp.model';

    @Injectable({
      providedIn: 'root'
    })
    export class InvitationService {
      private apiUrl = `${environment.apiUrl}/invitations`;

      constructor(private http: HttpClient) { }

      // Public endpoint
      getPublicInvitationBySlug(slug: string): Observable<Invitation> {
        return this.http.get<Invitation>(`${this.apiUrl}/public/${slug}`);
      }

      // Authenticated endpoints
      getAllInvitations(): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(this.apiUrl);
      }

      getInvitationById(id: number): Observable<Invitation> {
        return this.http.get<Invitation>(`${this.apiUrl}/${id}`);
      }

      getInvitationsByClientId(clientId: number): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(`${this.apiUrl}/client/${clientId}`);
      }

      getInvitationsByBuilderId(builderId: number): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(`${this.apiUrl}/builder/${builderId}`);
      }

      getInvitationsByBuilderIdAndStatus(builderId: number, status: string): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(`${this.apiUrl}/builder/${builderId}/status/${status}`);
      }

      createInvitation(clientId: number, templateId: number, content: string): Observable<Invitation> {
        return this.http.post<Invitation>(`${this.apiUrl}?clientId=${clientId}&templateId=${templateId}`, content);
      }

      updateInvitation(id: number, invitation: Invitation): Observable<Invitation> {
        return this.http.put<Invitation>(`${this.apiUrl}/${id}`, invitation);
      }

      deleteInvitation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }

      // RSVP endpoints
      createRsvp(invitationId: number, rsvp: Rsvp): Observable<Rsvp> {
        return this.http.post<Rsvp>(`${this.apiUrl}/${invitationId}/rsvps`, rsvp);
      }

      getRsvpsForInvitation(invitationId: number): Observable<Rsvp[]> {
        return this.http.get<Rsvp[]>(`${this.apiUrl}/${invitationId}/rsvps`);
      }

      deleteRsvp(invitationId: number, rsvpId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${invitationId}/rsvps/${rsvpId}`);
      }
    }
    ```

* **`src/app/core/interceptors/jwt.interceptor.ts`**
    ```typescript
    import { Injectable } from '@angular/core';
    import {
      HttpRequest,
      HttpHandler,
      HttpEvent,
      HttpInterceptor
    } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { AuthService } from '../services/auth.service';

    @Injectable()
    export class JwtInterceptor implements HttpInterceptor {

      constructor(private authService: AuthService) {}

      intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const accessToken = this.authService.getToken();
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        if (accessToken && isApiUrl) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`
            }
          });
        }

        return next.handle(request);
      }
    }
    ```

## 6. Routing Setup

Configure the main application routing in `src/app/app-routing.module.ts`. This will include public routes and protected routes based on user roles.

* **`src/app/app-routing.module.ts`**
    ```typescript
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { LoginComponent } from './auth/login/login.component';
    import { AuthGuard } from './core/guards/auth.guard';
    import { RoleGuard } from './core/guards/role.guard';
    import { PublicInvitationViewerComponent } from './public/public-invitation-viewer/public-invitation-viewer.component';
    import { ClientDashboardComponent } from './client/client-dashboard/client-dashboard.component';
    import { BuilderDashboardComponent } from './builder/builder-dashboard/builder-dashboard.component';
    import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
    import { SignupComponent } from './auth/signup/signup.component';
    import { AdminLandingComponent } from './admin/admin-landing/admin-landing.component';
    import { BuilderLandingComponent } from './builder/builder-landing/builder-landing.component';
    import { InvitationEditorComponent } from './builder/invitation-editor/invitation-editor.component';
    import { TemplateManagementComponent } from './admin/template-management/template-management.component';
    import { UserManagementComponent } from './admin/user-management/user-management.component';


    const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'invite/:slug', component: PublicInvitationViewerComponent }, // Public invitation view

      // Protected routes
      {
        path: 'client',
        component: ClientDashboardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CLIENT'] }
      },
      {
        path: 'builder',
        component: BuilderDashboardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['BUILDER'] },
        children: [
          { path: '', component: BuilderLandingComponent },
          { path: 'edit/:id', component: InvitationEditorComponent }
        ]
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: '', component: AdminLandingComponent },
          { path: 'users', component: UserManagementComponent },
          { path: 'templates', component: TemplateManagementComponent }
        ]
      },

      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: '**', redirectTo: '/login' } // Wildcard route for a 404-like page or redirect
    ];

    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
    })
    export class AppRoutingModule { }
    ```

* **`src/app/core/guards/auth.guard.ts`**
    ```typescript
    import { Injectable } from '@angular/core';
    import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
    import { Observable } from 'rxjs';
    import { AuthService } from '../services/auth.service';

    @Injectable({
      providedIn: 'root'
    })
    export class AuthGuard implements CanActivate {
      constructor(private authService: AuthService, private router: Router) {}

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.isAuthenticated()) {
          return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }
    ```

* **`src/app/core/guards/role.guard.ts`**
    ```typescript
    import { Injectable } from '@angular/core';
    import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
    import { Observable } from 'rxjs';
    import { AuthService } from '../services/auth.service';

    @Injectable({
      providedIn: 'root'
    })
    export class RoleGuard implements CanActivate {
      constructor(private authService: AuthService, private router: Router) {}

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const expectedRoles = route.data['roles'] as Array<string>; // e.g., ['ADMIN', 'BUILDER']
        const currentUser = this.authService.currentUserValue;

        if (currentUser && expectedRoles) {
          if (expectedRoles.includes(currentUser.role)) {
            return true;
          } else {
            // Role not authorized, redirect to a forbidden page or home
            this.router.navigate(['/']); // Or a dedicated /forbidden page
            return false;
          }
        }

        // Not logged in or no roles defined, redirect to login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }
    ```

## 7. Angular Modules and Components Structure

Organize your application into modules and components.

* **`src/app/app.module.ts`**
    ```typescript
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';

    // Angular Material Modules (import as needed)
    import { MatToolbarModule } from '@angular/material/toolbar';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';
    import { MatSidenavModule } from '@angular/material/sidenav';
    import { MatListModule } from '@angular/material/list';
    import { MatCardModule } from '@angular/material/card';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatInputModule } from '@angular/material/input';
    import { MatTableModule } from '@angular/material/table';
    import { MatPaginatorModule } from '@angular/material/paginator';
    import { MatSortModule } from '@angular/material/sort';
    import { MatDialogModule } from '@angular/material/dialog';
    import { MatSelectModule } from '@angular/material/select';
    import { MatTabsModule } from '@angular/material/tabs';
    import { MatSnackBarModule } from '@angular/material/snack-bar'; // For notifications

    // Components (declare all components here or in their respective feature modules)
    import { LoginComponent } from './auth/login/login.component';
    import { SignupComponent } from './auth/signup/signup.component';
    import { PublicInvitationViewerComponent } from './public/public-invitation-viewer/public-invitation-viewer.component';
    import { ClientDashboardComponent } from './client/client-dashboard/client-dashboard.component';
    import { BuilderDashboardComponent } from './builder/builder-dashboard/builder-dashboard.component';
    import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
    import { AdminLandingComponent } from './admin/admin-landing/admin-landing.component';
    import { BuilderLandingComponent } from './builder/builder-landing/builder-landing.component';
    import { InvitationEditorComponent } from './builder/invitation-editor/invitation-editor.component';
    import { TemplateManagementComponent } from './admin/template-management/template-management.component';
    import { UserManagementComponent } from './admin/user-management/user-management.component';
    import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
    import { RsvpFormComponent } from './public/rsvp-form/rsvp-form.component';
    import { MessageBoardComponent } from './public/message-board/message-board.component';
    import { TemplateSelectionComponent } from './client/template-selection/template-selection.component';
    import { InvitationFormComponent } from './client/invitation-form/invitation-form.component';
    import { PaymentIntegrationComponent } from './client/payment-integration/payment-integration.component';


    @NgModule({
      declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        PublicInvitationViewerComponent,
        ClientDashboardComponent,
        BuilderDashboardComponent,
        AdminDashboardComponent,
        AdminLandingComponent,
        BuilderLandingComponent,
        InvitationEditorComponent,
        TemplateManagementComponent,
        UserManagementComponent,
        RsvpFormComponent,
        MessageBoardComponent,
        TemplateSelectionComponent,
        InvitationFormComponent,
        PaymentIntegrationComponent,
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        // Angular Material Modules
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatSelectModule,
        MatTabsModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

* **`src/app/app.component.html`** (Basic layout with toolbar and router outlet)
    ```html
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Digital Invitations</span>
      <span class="spacer"></span>
      <button mat-button *ngIf="!authService.isAuthenticated()" routerLink="/login">Login</button>
      <button mat-button *ngIf="!authService.isAuthenticated()" routerLink="/signup">Sign Up</button>
      <button mat-button *ngIf="authService.isAuthenticated()" (click)="authService.logout()">Logout</button>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" [opened]="authService.isAuthenticated()">
        <mat-nav-list>
          <a mat-list-item routerLink="/client" *ngIf="authService.hasRole('CLIENT')">Client Dashboard</a>
          <a mat-list-item routerLink="/builder" *ngIf="authService.hasRole('BUILDER')">Builder Dashboard</a>
          <a mat-list-item routerLink="/admin" *ngIf="authService.hasRole('ADMIN')">Admin Dashboard</a>
          <!-- Add more specific links within dashboards here -->
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="content-container">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
    ```

* **`src/app/app.component.scss`** (Basic styling for layout)
    ```scss
    .sidenav-container {
      height: calc(100vh - 64px); // Adjust based on toolbar height
    }

    .mat-toolbar {
      .spacer {
        flex: 1 1 auto;
      }
    }

    .content-container {
      padding: 20px;
    }
    ```

* **`src/styles.scss`** (Global styles and custom theme)
    ```scss
    @use '@angular/material' as mat;

    // Define a custom color palette for your application's primary/accent colors
    // These are examples, adjust to your preferred neutral and elegant palette
    $my-app-primary-palette: (
      50: #e8eaf6,
      100: #c5cbe9,
      200: #a2a9da,
      300: #7f88cb,
      400: #6570c1,
      500: #4F7090, // Muted Indigo / Blue-Gray
      600: #476887,
      700: #3e5e7c,
      800: #365472,
      900: #27425f,
      A100: #8c9eff,
      A200: #536dfe,
      A400: #3d5afe,
      A700: #304ffe,
      contrast: (
        50: #000000,
        100: #000000,
        200: #000000,
        300: #ffffff,
        400: #ffffff,
        500: #ffffff,
        600: #ffffff,
        700: #ffffff,
        800: #ffffff,
        900: #ffffff,
        A100: #000000,
        A200: #ffffff,
        A400: #ffffff,
        A700: #ffffff,
      )
    );

    $my-app-accent-palette: (
      50: #f3e5f5,
      100: #e1bee7,
      200: #ce93d8,
      300: #ba68c8,
      400: #ab47bc,
      500: #9C27B0, // Example accent, could be a soft teal or another complementary color
      600: #8e24aa,
      700: #7b1fa2,
      800: #6a1b9a,
      900: #4a148c,
      A100: #ea80fc,
      A200: #e040fb,
      A400: #d500f9,
      A700: #aa00ff,
      contrast: (
        50: #000000,
        100: #000000,
        200: #000000,
        300: #000000,
        400: #ffffff,
        500: #ffffff,
        600: #ffffff,
        700: #ffffff,
        800: #ffffff,
        900: #ffffff,
        A100: #000000,
        A200: #ffffff,
        A400: #ffffff,
        A700: #ffffff,
      )
    );

    $my-app-warn-palette: mat.define-palette(mat.$red-palette);

    // Create the light theme
    $digital-invitations-theme: mat.define-light-theme((
      color: (
        primary: mat.define-palette($my-app-primary-palette),
        accent: mat.define-palette($my-app-accent-palette),
        warn: $my-app-warn-palette,
      ),
      typography: mat.define-typography-config(
        $font-family: 'Roboto, "Helvetica Neue", sans-serif'
      )
    ));

    // Apply the theme to all Angular Material components
    @include mat.all-component-themes($digital-invitations-theme);

    // Global Styles for the application background and general typography
    html, body {
      height: 100%;
      margin: 0;
      font-family: 'Roboto', "Helvetica Neue", sans-serif;
      background-color: #F8F9FA; // Light gray background for the app
      color: #343A40; // Default text color
    }

    // General heading styles
    h1, h2, h3, h4, h5, h6 {
      color: #4F7090; // Match primary accent for headings
      margin-top: 0;
      margin-bottom: 0.5em;
    }

    // Spacing utilities
    .mat-card {
      margin-bottom: 20px;
    }

    .mat-form-field {
      width: 100%;
    }

    // Custom styles for invitation-specific theming (handled dynamically)
    // These are placeholders. Actual invitation styles will be injected.
    .invitation-container {
      // This container will receive dynamic CSS variables for its theme
      background-color: var(--invitation-bg-color, #ffffff);
      color: var(--invitation-text-color, #333333);
      font-family: var(--invitation-font-family, sans-serif);
      // ... other dynamic properties
    }
    ```

## 8. Create Core Components

Create the main components for authentication and dashboards.

* **Authentication Components:**
    ```bash
    ng generate component auth/login
    ng generate component auth/signup
    ```
* **Public Viewer Component:**
    ```bash
    ng generate component public/public-invitation-viewer
    ng generate component public/rsvp-form
    ng generate component public/message-board
    ```
* **Client Dashboard Components:**
    ```bash
    ng generate component client/client-dashboard
    ng generate component client/template-selection
    ng generate component client/invitation-form
    ng generate component client/payment-integration
    ```
* **Builder Dashboard Components:**
    ```bash
    ng generate component builder/builder-dashboard
    ng generate component builder/builder-landing
    ng generate component builder/invitation-editor
    ```
* **Admin Dashboard Components:**
    ```bash
    ng generate component admin/admin-dashboard
    ng generate component admin/admin-landing
    ng generate component admin/user-management
    ng generate component admin/template-management
    ```

## 9. Implement Component Logic (Examples)

Here are high-level examples for some key components, focusing on Angular Material usage and backend integration.

* **`src/app/auth/login/login.component.ts`**
    ```typescript
    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { AuthService } from 'src/app/core/services/auth.service';
    import { Router, ActivatedRoute } from '@angular/router';
    import { MatSnackBar } from '@angular/material/snack-bar';

    @Component({
      selector: 'app-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.scss']
    })
    export class LoginComponent implements OnInit {
      loginForm: FormGroup;
      loading = false;
      returnUrl: string | null = null;

      constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
      ) {
        this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
        });
      }

      ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      }

      onSubmit(): void {
        if (this.loginForm.invalid) {
          return;
        }

        this.loading = true;
        this.authService.login(this.loginForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
            // Redirect based on role or returnUrl
            const userRole = this.authService.currentUserValue?.role;
            if (userRole === 'ADMIN') {
              this.router.navigate(['/admin']);
            } else if (userRole === 'BUILDER') {
              this.router.navigate(['/builder']);
            } else if (userRole === 'CLIENT') {
              this.router.navigate(['/client']);
            } else {
              this.router.navigate([this.returnUrl || '/']);
            }
          },
          error: (error) => {
            this.snackBar.open('Login failed: ' + (error.error.message || 'Invalid credentials'), 'Close', { duration: 5000 });
            this.loading = false;
          }
        });
      }
    }
    ```

* **`src/app/auth/login/login.component.html`**
    ```html
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || loading">
              <mat-icon *ngIf="loading">hourglass_empty</mat-icon>
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Don't have an account? <a routerLink="/signup">Sign Up</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
    ```

* **`src/app/builder/builder-landing/builder-landing.component.ts`**
    ```typescript
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { MatTableDataSource } from '@angular/material/table';
    import { MatPaginator } from '@angular/material/paginator';
    import { MatSort } from '@angular/material/sort';
    import { InvitationService } from 'src/app/core/services/invitation.service';
    import { AuthService } from 'src/app/core/services/auth.service';
    import { Invitation } from 'src/app/core/models/invitation.model';
    import { MatSnackBar } from '@angular/material/snack-bar';
    import { Router } from '@angular/router';

    @Component({
      selector: 'app-builder-landing',
      templateUrl: './builder-landing.component.html',
      styleUrls: ['./builder-landing.component.scss']
    })
    export class BuilderLandingComponent implements OnInit {
      currentInvitations: MatTableDataSource<Invitation>;
      pendingInvitations: MatTableDataSource<Invitation>;
      pastInvitations: MatTableDataSource<Invitation>;

      displayedColumns: string[] = ['id', 'slug', 'clientName', 'status', 'actions'];

      @ViewChild('currentPaginator') currentPaginator!: MatPaginator;
      @ViewChild('pendingPaginator') pendingPaginator!: MatPaginator;
      @ViewChild('pastPaginator') pastPaginator!: MatPaginator;

      @ViewChild('currentSort') currentSort!: MatSort;
      @ViewChild('pendingSort') pendingSort!: MatSort;
      @ViewChild('pastSort') pastSort!: MatSort;

      isLoading = true;

      constructor(
        private invitationService: InvitationService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
      ) {
        this.currentInvitations = new MatTableDataSource<Invitation>([]);
        this.pendingInvitations = new MatTableDataSource<Invitation>([]);
        this.pastInvitations = new MatTableDataSource<Invitation>([]);
      }

      ngOnInit(): void {
        this.loadBuilderInvitations();
      }

      ngAfterViewInit(): void {
        this.currentInvitations.paginator = this.currentPaginator;
        this.currentInvitations.sort = this.currentSort;
        this.pendingInvitations.paginator = this.pendingPaginator;
        this.pendingInvitations.sort = this.pendingSort;
        this.pastInvitations.paginator = this.pastPaginator;
        this.pastInvitations.sort = this.pastSort;
      }

      loadBuilderInvitations(): void {
        this.isLoading = true;
        const builderId = this.authService.currentUserValue?.id;

        if (builderId) {
          this.invitationService.getInvitationsByBuilderId(builderId).subscribe({
            next: (invitations) => {
              const current = invitations.filter(inv => inv.status === 'PUBLISHED');
              const pending = invitations.filter(inv => inv.status === 'PENDING_BUILDER_REVIEW' || inv.status === 'DRAFT');
              const past = invitations.filter(inv => inv.status === 'ARCHIVED'); // Or based on eventDate

              this.currentInvitations.data = current;
              this.pendingInvitations.data = pending;
              this.pastInvitations.data = past;
              this.isLoading = false;
            },
            error: (err) => {
              this.snackBar.open('Error loading invitations: ' + (err.error.message || err.message), 'Close', { duration: 5000 });
              this.isLoading = false;
            }
          });
        } else {
          this.snackBar.open('Builder ID not found. Please log in.', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      }

      editInvitation(invitationId: number | undefined): void {
        if (invitationId) {
          this.router.navigate(['/builder/edit', invitationId]);
        } else {
          this.snackBar.open('Invitation ID is missing.', 'Close', { duration: 3000 });
        }
      }

      // Helper to display client name in table
      getClientName(invitation: Invitation): string {
        return invitation.client?.name || 'N/A';
      }
    }
    ```

* **`src/app/builder/builder-landing/builder-landing.component.html`**
    ```html
    <div class="builder-landing-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Builder Dashboard</mat-card-title>
          <mat-card-subtitle>Manage your assigned invitation projects.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start">
            <mat-tab label="Pending Projects">
              <ng-template matTabContent>
                <div class="table-container">
                  <mat-spinner *ngIf="isLoading"></mat-spinner>
                  <div *ngIf="!isLoading && pendingInvitations.data.length === 0" class="no-data-message">
                    No pending invitations found.
                  </div>
                  <table mat-table [dataSource]="pendingInvitations" matSort #pendingSort="matSort" *ngIf="!isLoading && pendingInvitations.data.length > 0">
                    <!-- ID Column -->
                    <ng-container matColumnDef="id">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
                      <td mat-cell *matCellDef="let invitation"> {{invitation.id}} </td>
                    </ng-container>

                    <!-- Slug Column -->
                    <ng-container matColumnDef="slug">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header> Slug </th>
                      <td mat-cell *matCellDef="let invitation"> {{invitation.slug}} </td>
                    </ng-container>

                    <!-- Client Name Column -->
                    <ng-container matColumnDef="clientName">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header> Client </th>
                      <td mat-cell *matCellDef="let invitation"> {{getClientName(invitation)}} </td>
                    </ng-container>

                    <!-- Status Column -->
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
                      <td mat-cell *matCellDef="let invitation"> {{invitation.status}} </td>
                    </ng-container>

                    <!-- Actions Column -->
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef> Actions </th>
                      <td mat-cell *matCellDef="let invitation">
                        <button mat-icon-button color="primary" (click)="editInvitation(invitation.id)" matTooltip="Edit Invitation">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                  <mat-paginator #pendingPaginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons *ngIf="!isLoading && pendingInvitations.data.length > 0"></mat-paginator>
                </div>
              </ng-template>
            </mat-tab>

            <mat-tab label="Current Projects">
              <ng-template matTabContent>
                <div class="table-container">
                  <mat-spinner *ngIf="isLoading"></mat-spinner>
                  <div *ngIf="!isLoading && currentInvitations.data.length === 0" class="no-data-message">
                    No current (published) invitations found.
                  </div>
                  <table mat-table [dataSource]="currentInvitations" matSort #currentSort="matSort" *ngIf="!isLoading && currentInvitations.data.length > 0">
                    <!-- Same columns as above -->
                    <ng-container matColumnDef="id"> <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th> <td mat-cell *matCellDef="let invitation"> {{invitation.id}} </td> </ng-container>
                    <ng-container matColumnDef="slug"> <th mat-header-cell *matHeaderCellDef mat-sort-header> Slug </th> <td mat-cell *matCellDef="let invitation"> {{invitation.slug}} </td> </ng-container>
                    <ng-container matColumnDef="clientName"> <th mat-header-cell *matHeaderCellDef mat-sort-header> Client </th> <td mat-cell *matCellDef="let invitation"> {{getClientName(invitation)}} </td> </ng-container>
                    <ng-container matColumnDef="status"> <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th> <td mat-cell *matCellDef="let invitation"> {{invitation.status}} </td> </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef> Actions </th>
                      <td mat-cell *matCellDef="let invitation">
                        <button mat-icon-button color="accent" [routerLink]="['/invite', invitation.slug]" target="_blank" matTooltip="View Public Invitation">
                          <mat-icon>visibility</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                  <mat-paginator #currentPaginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons *ngIf="!isLoading && currentInvitations.data.length > 0"></mat-paginator>
                </div>
              </ng-template>
            </mat-tab>

            <mat-tab label="Past Projects">
              <ng-template matTabContent>
                <div class="table-container">
                  <mat-spinner *ngIf="isLoading"></mat-spinner>
                  <div *ngIf="!isLoading && pastInvitations.data.length === 0" class="no-data-message">
                    No past (archived) invitations found.
                  </div>
                  <table mat-table [dataSource]="pastInvitations" matSort #pastSort="matSort" *ngIf="!isLoading && pastInvitations.data.length > 0">
                    <!-- Same columns as above -->
                    <ng-container matColumnDef="id"> <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th> <td mat-cell *matCellDef="let invitation"> {{invitation.id}} </td> </ng-container>
                    <ng-container matColumnDef="slug"> <th mat-header-cell *matHeaderCellDef mat-sort-header> Slug </th> <td mat-cell *matCellDef="let invitation"> {{invitation.slug}} </td> </ng-container>
                    <ng-container matColumnDef="clientName"> <th mat-header-cell *matHeaderCellDef mat-sort-header> Client </th> <td mat-cell *matCellDef="let invitation"> {{getClientName(invitation)}} </td> </ng-container>
                    <ng-container matColumnDef="status"> <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th> <td mat-cell *matCellDef="let invitation"> {{invitation.status}} </td> </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef> Actions </th>
                      <td mat-cell *matCellDef="let invitation">
                        <!-- No actions for past projects, or view only -->
                        <button mat-icon-button [routerLink]="['/invite', invitation.slug]" target="_blank" matTooltip="View Public Invitation">
                          <mat-icon>visibility</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                  <mat-paginator #pastPaginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons *ngIf="!isLoading && pastInvitations.data.length > 0"></mat-paginator>
                </div>
              </ng-template>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
    ```

* **`src/app/builder/builder-landing/builder-landing.component.scss`**
    ```scss
    .builder-landing-container {
      padding: 20px;

      mat-card {
        max-width: 1200px;
        margin: 0 auto;
      }

      .table-container {
        position: relative;
        min-height: 200px; // Ensure space for spinner
        margin-top: 20px;
      }

      mat-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      table {
        width: 100%;
      }

      .no-data-message {
        text-align: center;
        padding: 20px;
        color: #6c757d;
      }
    }
    ```