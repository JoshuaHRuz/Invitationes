---
# Digital Invitation Platform

This project is a web platform designed for creating and sending digital invitations for various events like weddings, birthdays, and graduations. It supports four distinct user roles: Admin, Builder, Client, and Viewer. This platform will be primarily in spanish. 

---

## 🎯 Objective

The primary goal is to enable clients to create personalized invitations that their guests (Viewers) can access via a public link. Clients will need to log in to order an invitation, while guests can view invitations without any authentication.

---

## 👥 User Roles

* **Admin**: Manages users, templates, and platform statistics.
* **Builder**: Edits templates with content provided by the client.
* **Client**: Requests and pays for invitations. Requires login for access.
* **Viewer**: Views the invitation without needing to log in. Can RSVP and leave messages.

---

## 🧱 Technologies

* **Frontend**: Angular (with Angular Material)
* **Backend**: Spring Boot (using JWT for authentication and MVC arquitecture)
* **Database**: MariaDB

---

## 📌 Requirements

* **Client Flow**: Clients can log in, select a template, fill out a form with event details, and process payment.
* **Builder Interface**: Builders edit templates using a split-screen interface (form on the left, preview on the right).
* **Viewer Access**: Viewers access invitations via a public link and can confirm attendance (RSVP) or leave a message.
* **Admin Panel**: Admins manage all aspects of the platform from a dedicated dashboard.
* **Admin & Builder Landing Pages**: Both Admin and Builder landing pages must display "current, past, and pending projects" (invitations).

---

## Frontend (Angular)

### Key Components (Leveraging Angular Material)

* **`LoginComponent`**: Handles user authentication. (e.g., `mat-form-field`, `mat-input`, `mat-button`)
* **`ClientDashboardComponent`**:
    * **`TemplateSelectionComponent`**: Displays available templates for clients to choose from. (e.g., `mat-card`, `mat-grid-list`)
    * **`InvitationFormComponent`**: Allows clients to input event details for their invitation. (e.g., `mat-form-field`, `mat-input`, `mat-datepicker`, `mat-checkbox`)
    * **`PaymentIntegrationComponent`**: Handles the payment process. (e.g., `mat-progress-spinner`)
* **`BuilderDashboardComponent`**:
    * **`BuilderLandingComponent`**: Displays a summary of "Current," "Past," and "Pending" invitation projects assigned to the builder. (e.g., `mat-tab-group`, `mat-table` or `mat-list` for project lists, `mat-card` for summaries)
    * **`InvitationEditorComponent`**: The core builder interface with split-screen editing (form input and real-time preview). (e.g., `mat-sidenav` or CSS grid for layout, `mat-form-field`, `mat-input`, `mat-select` for content editing)
* **`AdminDashboardComponent`**:
    * **`AdminLandingComponent`**: Displays an overview of all "Current," "Past," and "Pending" invitation projects across the platform, along with system-wide statistics. (e.g., `mat-tab-group`, `mat-table` for project lists, `mat-card` for statistics, `mat-paginator` for large lists)
    * **`UserManagementComponent`**: For managing user accounts. (e.g., `mat-table`, `mat-dialog` for edit/add user forms)
    * **`TemplateManagementComponent`**: For adding, editing, or deleting templates. (e.g., `mat-table`, `mat-dialog`)
    * **`StatisticsComponent`**: Displays platform usage and other relevant data. (e.g., `mat-card`, charts)
* **`PublicInvitationViewerComponent`**:
    * Displays the digital invitation content based on the public slug.
    * **`RsvpFormComponent`**: Allows viewers to RSVP. (e.g., `mat-form-field`, `mat-input`, `mat-radio-button`)
    * **`MessageBoardComponent`**: Allows viewers to leave messages. (e.g., `mat-list`, `mat-form-field`, `mat-input`)
 
* **When generating Angular code for the Digital Invitation Platform, prioritize the following theming strategy:**

1.  **Core Application UI:** Use a neutral, clean, and professional color palette for all fixed UI elements (dashboards, navigation, forms, primary buttons). The goal is a subtle backdrop that doesn't compete with invitation designs. Leverage Angular Material's theming capabilities for this.

2.  **Invitation-Specific Themes:** Understand that each *invitation* will have its *own distinct color palette and design*. These themes are dynamic and should be loaded based on invitation data, impacting only the invitation's viewing/editing area.

Avoid strong, opinionated colors in the core app UI to prevent clashes with diverse invitation themes.
---

## Backend (Spring Boot)

### REST Endpoints

#### User Management

* `POST /api/auth/login`: Authenticates user and returns JWT.
* `POST /api/users`: Creates a new user (Admin only).
* `GET /api/users`: Retrieves all users (Admin only).
* `GET /api/users/{id}`: Retrieves a specific user (Admin, or self).
* `PUT /api/users/{id}`: Updates a user (Admin, or self).
* `DELETE /api/users/{id}`: Deletes a user (Admin only).

#### Template Management

* `GET /api/templates`: Retrieves all available templates.
* `GET /api/templates/{id}`: Retrieves a specific template.
* `POST /api/templates`: Creates a new template (Admin only).
* `PUT /api/templates/{id}`: Updates an existing template (Admin only).
* `DELETE /api/templates/{id}`: Deletes a template (Admin only).

#### Invitation Management

* `POST /api/invitations`: Creates a new invitation (Client).
* `GET /api/invitations/client/{clientId}`: Retrieves invitations for a specific client.
* `GET /api/invitations/builder/{builderId}`: Retrieves invitations assigned to a specific builder (Builder).
* `GET /api/invitations`: Retrieves all invitations (Admin).
* `GET /api/invitations/{id}`: Retrieves a specific invitation (Admin, Builder, or Client if owned).
* `GET /api/invitations/public/{slug}`: Retrieves a public invitation by slug (Viewer).
* `PUT /api/invitations/{id}`: Updates an invitation (Builder, Admin).
* `DELETE /api/invitations/{id}`: Deletes an invitation (Admin).

#### RSVP Management

* `POST /api/invitations/{invitationId}/rsvp`: Submits an RSVP for an invitation (Viewer).
* `GET /api/invitations/{invitationId}/rsvps`: Retrieves all RSVPs for a given invitation (Client, Admin, Builder).

---

## Database Schema (MariaDB)

```sql
-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password
    role ENUM('admin', 'builder', 'client') NOT NULL
);

-- Templates Table
CREATE TABLE templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    preview_image_url VARCHAR(255)
);

-- Invitations Table
CREATE TABLE invitations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    builder_id BIGINT, -- New field to assign invitations to builders
    slug VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('draft', 'pending_builder_review', 'published', 'archived') NOT NULL,
    content JSON, -- Stores the dynamic content of the invitation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (template_id) REFERENCES templates(id),
    FOREIGN KEY (builder_id) REFERENCES users(id) -- Reference to builder user
);

-- RSVPs Table
CREATE TABLE rsvps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    response ENUM('yes', 'no', 'maybe') NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id)
);