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

    * Follow the prompts:
        * Choose a prebuilt theme (e.g., `Indigo/Pink` or `Deep Purple/Amber`). You'll customize it later.
        * Set up global Angular Material typography styles: `Yes`.
        * Include Angular Material's prebuilt CSS for common styles: `Yes`.

## 3. Define Data Models / Interfaces

Create TypeScript interfaces that mirror your Spring Boot backend entities/DTOs. This ensures type safety and consistency. You can improve the models if you think they can have more properties. Create a folder `src/app/core/models`.

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


## 6. Routing Setup

Configure the main application routing in. This will include public routes and protected routes based on user roles.

## 7. Angular Modules and Components Structure

Organize your application into modules and components.


## 8. Create Core Components

Create the main components for authentication and dashboards.

* **Authentication Components:**
* **Public Viewer Component:**
* **Client Dashboard Components:**
* **Builder Dashboard Components:**
* **Admin Dashboard Components:**

## 9. Implement Component Logic (Examples)

 Focusing on Angular Material usage and backend integration.

## 10. Make sure landing page is the defaul and a button in landing page is for login.