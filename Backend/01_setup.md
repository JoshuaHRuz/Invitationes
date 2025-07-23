---
# Backend Setup: Spring Boot for Digital Invitation Platform

This section details the step-by-step process to set up the Spring Boot backend for the Digital Invitation Platform.

## 1. Project Initialization

We will use Spring Initializr to generate the basic project structure.

* **Access Spring Initializr:** Go to [https://start.spring.io/](https://start.spring.io/)
* **Project Settings:**
    * **Project:** Maven Project (or Gradle Project if preferred)
    * **Language:** Java
    * **Spring Boot:** Choose the latest stable version (e.g., `3.3.1` or newer)
    * **Group:** `com.digitalinvitations` (or your preferred group)
    * **Artifact:** `backend` (or `digital-invitations-backend`)
    * **Name:** `backend`
    * **Description:** `Backend for Digital Invitation Platform`
    * **Package Name:** `com.digitalinvitations.backend`
    * **Packaging:** Jar
    * **Java:** Choose Java 17 or newer (LTS version)
* **Dependencies:** Add the following dependencies:
    * **Spring Web:** For building RESTful APIs.
    * **Spring Data JPA:** For database interaction and ORM.
    * **MariaDB Driver:** To connect to the MariaDB database.
    * **Spring Security:** For authentication and authorization (specifically JWT).
    * **JJWT API, Impl, Jackson:** For JWT token generation and validation. (You'll add these manually or search for them if Initializr has them directly)
        * Search for `io.jsonwebtoken`
    * **Spring Boot DevTools:** (Optional, highly recommended for development) Provides hot-swapping and live reload.
    * **Lombok:** (Optional, highly recommended) Reduces boilerplate code (getters, setters, constructors).

* **Generate:** Click "Generate" and download the `.zip` file.
* **Unpack:** Extract the contents of the zip file into your desired project directory.
* **Open in IDE:** Import the project into your favorite IDE (IntelliJ IDEA, VS Code, Eclipse).

## 2. Database Configuration (MariaDB)

Configure your `application.properties` or `application.yml` file to connect to MariaDB.

* **Locate:** Open `src/main/resources/application.properties` (or create `application.yml`).

* **Add Configuration:**

    **`src/main/resources/application.properties`**
    ```properties
    # MariaDB Database Configuration
    spring.datasource.url=jdbc:mariadb://localhost:3306/digital_invitations_db?useSSL=false&allowPublicKeyRetrieval=true
    spring.datasource.username=your_mariadb_user
    spring.datasource.password=your_mariadb_password
    spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

    # JPA and Hibernate Configuration
    spring.jpa.hibernate.ddl-auto=update # Use 'update' for development, 'validate' or 'none' for production
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.format_sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

    # Server Port
    server.port=8080 # Default Spring Boot port
    ```

    **OR `src/main/resources/application.yml`**
    ```yaml
    spring:
      datasource:
        url: jdbc:mariadb://localhost:3306/digital_invitations_db?useSSL=false&allowPublicKeyRetrieencyRetrieval=true
        username: your_mariadb_user
        password: your_mariadb_password
        driver-class-name: org.mariadb.jdbc.Driver
      jpa:
        hibernate:
          ddl-auto: update # Use 'update' for development, 'validate' or 'none' for production
        show-sql: true
        properties:
          hibernate:
            format_sql: true
            dialect: org.hibernate.dialect.MariaDBDialect
    server:
      port: 8080 # Default Spring Boot port
    ```
* **Database Setup:** Ensure you have a MariaDB server running and a database named `digital_invitations_db` created, along with a user with appropriate permissions.

## 3. Define Data Entities (JPA)

Create Java classes representing your database tables in `src/main/java/com/digitalinvitations/backend/model`.

* **`User.java`**
    ```java
    package com.digitalinvitations.backend.model;

    import jakarta.persistence.*;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;

    @Entity
    @Table(name = "users")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class User {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String email;
        private String password; // Store hashed password
        
        @Enumerated(EnumType.STRING)
        private Role role;

        public enum Role {
            ADMIN, BUILDER, CLIENT
        }
    }
    ```

* **`Template.java`**
    ```java
    package com.digitalinvitations.backend.model;

    import jakarta.persistence.*;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;

    @Entity
    @Table(name = "templates")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Template {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String category;
        private String previewImageUrl;
    }
    ```

* **`Invitation.java`**
    ```java
    package com.digitalinvitations.backend.model;

    import jakarta.persistence.*;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import org.hibernate.annotations.JdbcTypeCode;
    import org.hibernate.type.SqlTypes;

    import java.time.LocalDateTime;

    @Entity
    @Table(name = "invitations")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Invitation {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "client_id", nullable = false)
        private User client;

        @ManyToOne
        @JoinColumn(name = "template_id", nullable = false)
        private Template template;

        @ManyToOne
        @JoinColumn(name = "builder_id") // Can be null until assigned
        private User builder;

        @Column(unique = true, nullable = false)
        private String slug;

        @Enumerated(EnumType.STRING)
        private InvitationStatus status;

        @JdbcTypeCode(SqlTypes.JSON) // For JSON content type in MariaDB 10.2+
        @Column(columnDefinition = "json")
        private String content; // Stored as JSON string

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        @PrePersist
        protected void onCreate() {
            createdAt = LocalDateTime.now();
            updatedAt = LocalDateTime.now();
        }

        @PreUpdate
        protected void onUpdate() {
            updatedAt = LocalDateTime.now();
        }

        public enum InvitationStatus {
            DRAFT, PENDING_BUILDER_REVIEW, PUBLISHED, ARCHIVED
        }
    }
    ```

* **`Rsvp.java`**
    ```java
    package com.digitalinvitations.backend.model;

    import jakarta.persistence.*;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;

    import java.time.LocalDateTime;

    @Entity
    @Table(name = "rsvps")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Rsvp {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "invitation_id", nullable = false)
        private Invitation invitation;

        private String name;
        
        @Enumerated(EnumType.STRING)
        private RsvpResponse response; // YES, NO, MAYBE

        @Column(columnDefinition = "TEXT")
        private String message;

        private LocalDateTime createdAt;

        @PrePersist
        protected void onCreate() {
            createdAt = LocalDateTime.now();
        }

        public enum RsvpResponse {
            YES, NO, MAYBE
        }
    }
    ```

## 4. Create Repositories (Spring Data JPA)

Create interfaces for basic CRUD operations in `src/main/java/com/digitalinvitations/backend/repository`.

* **`UserRepository.java`**
    ```java
    package com.digitalinvitations.backend.repository;

    import com.digitalinvitations.backend.model.User;
    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.Optional;

    public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByEmail(String email);
        long countByRole(User.Role role);
    }
    ```

* **`TemplateRepository.java`**
    ```java
    package com.digitalinvitations.backend.repository;

    import com.digitalinvitations.backend.model.Template;
    import org.springframework.data.jpa.repository.JpaRepository;

    public interface TemplateRepository extends JpaRepository<Template, Long> {
        // Custom queries can be added here if needed
    }
    ```

* **`InvitationRepository.java`**
    ```java
    package com.digitalinvitations.backend.repository;

    import com.digitalinvitations.backend.model.Invitation;
    import com.digitalinvitations.backend.model.Invitation.InvitationStatus;
    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.List;
    import java.util.Optional;

    public interface InvitationRepository extends JpaRepository<Invitation, Long> {
        List<Invitation> findByClient_Id(Long clientId);
        List<Invitation> findByBuilder_Id(Long builderId);
        List<Invitation> findByStatus(InvitationStatus status);
        List<Invitation> findByBuilder_IdAndStatus(Long builderId, InvitationStatus status);
        Optional<Invitation> findBySlug(String slug);
    }
    ```

* **`RsvpRepository.java`**
    ```java
    package com.digitalinvitations.backend.repository;

    import com.digitalinvitations.backend.model.Rsvp;
    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.List;

    public interface RsvpRepository extends JpaRepository<Rsvp, Long> {
        List<Rsvp> findByInvitation_Id(Long invitationId);
    }
    ```

## 5. Implement Services (Business Logic)

Create service classes in `src/main/java/com/digitalinvitations/backend/service` to encapsulate business logic.

* **`UserService.java`**
    ```java
    package com.digitalinvitations.backend.service;

    import com.digitalinvitations.backend.model.User;
    import com.digitalinvitations.backend.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.Optional;

    @Service
    public class UserService {

        @Autowired
        private UserRepository userRepository;
        @Autowired
        private PasswordEncoder passwordEncoder; // Will be configured in SecurityConfig

        public List<User> findAllUsers() {
            return userRepository.findAll();
        }

        public Optional<User> findUserById(Long id) {
            return userRepository.findById(id);
        }

        public Optional<User> findUserByEmail(String email) {
            return userRepository.findByEmail(email);
        }

        public User saveUser(User user) {
            // Hash password before saving
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            return userRepository.save(user);
        }

        public User updateUser(Long id, User userDetails) {
            return userRepository.findById(id).map(user -> {
                user.setName(userDetails.getName());
                user.setEmail(userDetails.getEmail());
                // Only update password if provided and not empty
                if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                }
                user.setRole(userDetails.getRole());
                return userRepository.save(user);
            }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
        }

        public void deleteUser(Long id) {
            userRepository.deleteById(id);
        }
    }
    ```

* **`TemplateService.java`**
    ```java
    package com.digitalinvitations.backend.service;

    import com.digitalinvitations.backend.model.Template;
    import com.digitalinvitations.backend.repository.TemplateRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.Optional;

    @Service
    public class TemplateService {

        @Autowired
        private TemplateRepository templateRepository;

        public List<Template> findAllTemplates() {
            return templateRepository.findAll();
        }

        public Optional<Template> findTemplateById(Long id) {
            return templateRepository.findById(id);
        }

        public Template saveTemplate(Template template) {
            return templateRepository.save(template);
        }

        public Template updateTemplate(Long id, Template templateDetails) {
            return templateRepository.findById(id).map(template -> {
                template.setName(templateDetails.getName());
                template.setCategory(templateDetails.getCategory());
                template.setPreviewImageUrl(templateDetails.getPreviewImageUrl());
                return templateRepository.save(template);
            }).orElseThrow(() -> new RuntimeException("Template not found with id " + id));
        }

        public void deleteTemplate(Long id) {
            templateRepository.deleteById(id);
        }
    }
    ```

* **`InvitationService.java`**
    ```java
    package com.digitalinvitations.backend.service;

    import com.digitalinvitations.backend.model.Invitation;
    import com.digitalinvitations.backend.model.User;
    import com.digitalinvitations.backend.model.Template;
    import com.digitalinvitations.backend.repository.InvitationRepository;
    import com.digitalinvitations.backend.repository.UserRepository;
    import com.digitalinvitations.backend.repository.TemplateRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.Optional;
    import java.util.UUID; // For generating slugs

    @Service
    public class InvitationService {

        @Autowired
        private InvitationRepository invitationRepository;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private TemplateRepository templateRepository;

        public List<Invitation> findAllInvitations() {
            return invitationRepository.findAll();
        }

        public Optional<Invitation> findInvitationById(Long id) {
            return invitationRepository.findById(id);
        }

        public Optional<Invitation> findInvitationBySlug(String slug) {
            return invitationRepository.findBySlug(slug);
        }

        public List<Invitation> findInvitationsByClientId(Long clientId) {
            return invitationRepository.findByClient_Id(clientId);
        }

        public List<Invitation> findInvitationsByBuilderId(Long builderId) {
            return invitationRepository.findByBuilder_Id(builderId);
        }

        public List<Invitation> findInvitationsByBuilderIdAndStatus(Long builderId, Invitation.InvitationStatus status) {
            return invitationRepository.findByBuilder_IdAndStatus(builderId, status);
        }

        public Invitation createInvitation(Long clientId, Long templateId, String content) {
            User client = userRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            Template template = templateRepository.findById(templateId)
                    .orElseThrow(() -> new RuntimeException("Template not found"));

            Invitation invitation = new Invitation();
            invitation.setClient(client);
            invitation.setTemplate(template);
            invitation.setContent(content);
            invitation.setStatus(Invitation.InvitationStatus.DRAFT);
            invitation.setSlug(generateUniqueSlug()); // Generate a unique slug
            invitation.setCreatedAt(LocalDateTime.now());
            invitation.setUpdatedAt(LocalDateTime.now());
            return invitationRepository.save(invitation);
        }

        public Invitation updateInvitation(Long id, Invitation invitationDetails) {
            return invitationRepository.findById(id).map(invitation -> {
                // Update fields based on business logic and user role
                invitation.setBuilder(invitationDetails.getBuilder()); // Admin can assign builder
                invitation.setStatus(invitationDetails.getStatus());
                invitation.setContent(invitationDetails.getContent());
                invitation.setSlug(invitationDetails.getSlug()); // Allow slug update for builder/admin
                invitation.setUpdatedAt(LocalDateTime.now());
                return invitationRepository.save(invitation);
            }).orElseThrow(() -> new RuntimeException("Invitation not found with id " + id));
        }

        public void deleteInvitation(Long id) {
            invitationRepository.deleteById(id);
        }

        private String generateUniqueSlug() {
            String slug;
            do {
                slug = UUID.randomUUID().toString().substring(0, 8); // Simple 8-char slug
            } while (invitationRepository.findBySlug(slug).isPresent());
            return slug;
        }
    }
    ```

* **`RsvpService.java`**
    ```java
    package com.digitalinvitations.backend.service;

    import com.digitalinvitations.backend.model.Invitation;
    import com.digitalinvitations.backend.model.Rsvp;
    import com.digitalinvitations.backend.repository.InvitationRepository;
    import com.digitalinvitations.backend.repository.RsvpRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.util.List;

    @Service
    public class RsvpService {

        @Autowired
        private RsvpRepository rsvpRepository;
        @Autowired
        private InvitationRepository invitationRepository;

        public Rsvp createRsvp(Long invitationId, String name, Rsvp.RsvpResponse response, String message) {
            Invitation invitation = invitationRepository.findById(invitationId)
                    .orElseThrow(() -> new RuntimeException("Invitation not found with id " + invitationId));

            Rsvp rsvp = new Rsvp();
            rsvp.setInvitation(invitation);
            rsvp.setName(name);
            rsvp.setResponse(response);
            rsvp.setMessage(message);
            return rsvpRepository.save(rsvp);
        }

        public List<Rsvp> findRsvpsByInvitationId(Long invitationId) {
            return rsvpRepository.findByInvitation_Id(invitationId);
        }

        public void deleteRsvp(Long id) {
            rsvpRepository.deleteById(id);
        }
    }
    ```

## 6. Implement REST Controllers

Create REST controllers in `src/main/java/com/digitalinvitations/backend/controller` to expose your API endpoints.

* **`UserController.java`**
    ```java
    package com.digitalinvitations.backend.controller;

    import com.digitalinvitations.backend.model.User;
    import com.digitalinvitations.backend.service.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/users")
    public class UserController {

        @Autowired
        private UserService userService;

        @GetMapping
        @PreAuthorize("hasAuthority('ADMIN')")
        public List<User> getAllUsers() {
            return userService.findAllUsers();
        }

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('CLIENT') and #id == authentication.principal.id) or (hasAuthority('BUILDER') and #id == authentication.principal.id)")
        public ResponseEntity<User> getUserById(@PathVariable Long id) {
            return userService.findUserById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        @PostMapping
        @PreAuthorize("hasAuthority('ADMIN')") // Only Admin can create users directly
        public User createUser(@RequestBody User user) {
            return userService.saveUser(user);
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('CLIENT') and #id == authentication.principal.id) or (hasAuthority('BUILDER') and #id == authentication.principal.id)")
        public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
            return ResponseEntity.ok(userService.updateUser(id, userDetails));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        }
    }
    ```

* **`TemplateController.java`**
    ```java
    package com.digitalinvitations.backend.controller;

    import com.digitalinvitations.backend.model.Template;
    import com.digitalinvitations.backend.service.TemplateService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/templates")
    public class TemplateController {

        @Autowired
        private TemplateService templateService;

        @GetMapping
        public List<Template> getAllTemplates() {
            return templateService.findAllTemplates();
        }

        @GetMapping("/{id}")
        public ResponseEntity<Template> getTemplateById(@PathVariable Long id) {
            return templateService.findTemplateById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        @PostMapping
        @PreAuthorize("hasAuthority('ADMIN')")
        public Template createTemplate(@RequestBody Template template) {
            return templateService.saveTemplate(template);
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<Template> updateTemplate(@PathVariable Long id, @RequestBody Template templateDetails) {
            return ResponseEntity.ok(templateService.updateTemplate(id, templateDetails));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
            templateService.deleteTemplate(id);
            return ResponseEntity.noContent().build();
        }
    }
    ```

* **`InvitationController.java`**
    ```java
    package com.digitalinvitations.backend.controller;

    import com.digitalinvitations.backend.model.Invitation;
    import com.digitalinvitations.backend.model.Invitation.InvitationStatus;
    import com.digitalinvitations.backend.service.InvitationService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/invitations")
    public class InvitationController {

        @Autowired
        private InvitationService invitationService;

        // Public endpoint for viewing invitations
        @GetMapping("/public/{slug}")
        public ResponseEntity<Invitation> getPublicInvitationBySlug(@PathVariable String slug) {
            return invitationService.findInvitationBySlug(slug)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        // --- Authenticated Endpoints ---

        @GetMapping // Admin only: get all invitations
        @PreAuthorize("hasAuthority('ADMIN')")
        public List<Invitation> getAllInvitations() {
            return invitationService.findAllInvitations();
        }

        @GetMapping("/{id}") // Admin, Builder (if assigned), Client (if owned)
        @PreAuthorize("hasAuthority('ADMIN') or " +
                      "(hasAuthority('BUILDER') and @invitationService.findInvitationById(#id).orElse(null)?.builder?.id == authentication.principal.id) or " +
                      "(hasAuthority('CLIENT') and @invitationService.findInvitationById(#id).orElse(null)?.client?.id == authentication.principal.id)")
        public ResponseEntity<Invitation> getInvitationById(@PathVariable Long id) {
            return invitationService.findInvitationById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping("/client/{clientId}") // Client: get their invitations
        @PreAuthorize("hasAuthority('CLIENT') and #clientId == authentication.principal.id")
        public List<Invitation> getInvitationsByClient(@PathVariable Long clientId) {
            return invitationService.findInvitationsByClientId(clientId);
        }

        @GetMapping("/builder/{builderId}") // Builder: get their assigned invitations
        @PreAuthorize("hasAuthority('BUILDER') and #builderId == authentication.principal.id")
        public List<Invitation> getInvitationsByBuilder(@PathVariable Long builderId) {
            return invitationService.findInvitationsByBuilderId(builderId);
        }

        @GetMapping("/builder/{builderId}/status/{status}") // Builder: filter by status
        @PreAuthorize("hasAuthority('BUILDER') and #builderId == authentication.principal.id")
        public List<Invitation> getInvitationsByBuilderAndStatus(@PathVariable Long builderId, @PathVariable InvitationStatus status) {
            return invitationService.findInvitationsByBuilderIdAndStatus(builderId, status);
        }

        @PostMapping // Client: create new invitation draft
        @PreAuthorize("hasAuthority('CLIENT')")
        public Invitation createInvitation(@RequestParam Long clientId, @RequestParam Long templateId, @RequestBody String content) {
            // In a real app, ensure clientId matches authenticated user's ID
            return invitationService.createInvitation(clientId, templateId, content);
        }

        @PutMapping("/{id}") // Builder or Admin: update invitation details/status
        @PreAuthorize("hasAuthority('ADMIN') or " +
                      "(hasAuthority('BUILDER') and @invitationService.findInvitationById(#id).orElse(null)?.builder?.id == authentication.principal.id)")
        public ResponseEntity<Invitation> updateInvitation(@PathVariable Long id, @RequestBody Invitation invitationDetails) {
            return ResponseEntity.ok(invitationService.updateInvitation(id, invitationDetails));
        }

        @DeleteMapping("/{id}") // Admin only: delete invitation
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<Void> deleteInvitation(@PathVariable Long id) {
            invitationService.deleteInvitation(id);
            return ResponseEntity.noContent().build();
        }
    }
    ```

* **`RsvpController.java`**
    ```java
    package com.digitalinvitations.backend.controller;

    import com.digitalinvitations.backend.model.Rsvp;
    import com.digitalinvitations.backend.service.RsvpService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/invitations/{invitationId}/rsvps")
    public class RsvpController {

        @Autowired
        private RsvpService rsvpService;

        @PostMapping // Public endpoint for viewers to RSVP
        @ResponseStatus(HttpStatus.CREATED)
        public Rsvp createRsvp(@PathVariable Long invitationId, @RequestBody Rsvp rsvpRequest) {
            return rsvpService.createRsvp(invitationId, rsvpRequest.getName(), rsvpRequest.getResponse(), rsvpRequest.getMessage());
        }

        @GetMapping // Client (for their invitation), Builder (if assigned), Admin
        @PreAuthorize("hasAuthority('ADMIN') or " +
                      "(@invitationService.findInvitationById(#invitationId).orElse(null)?.client?.id == authentication.principal.id) or " +
                      "(@invitationService.findInvitationById(#invitationId).orElse(null)?.builder?.id == authentication.principal.id)")
        public List<Rsvp> getRsvpsForInvitation(@PathVariable Long invitationId) {
            return rsvpService.findRsvpsByInvitationId(invitationId);
        }

        @DeleteMapping("/{id}") // Admin, or Client (for their invitation's RSVP)
        @PreAuthorize("hasAuthority('ADMIN') or " +
                      "(@rsvpService.findRsvpById(#id).orElse(null)?.invitation?.client?.id == authentication.principal.id)")
        public ResponseEntity<Void> deleteRsvp(@PathVariable Long id) {
            rsvpService.deleteRsvp(id);
            return ResponseEntity.noContent().build();
        }
    }
    ```

## 7. Implement Security (Spring Security & JWT)

This is a crucial and more complex part. We'll set up JWT authentication.

* **Add JWT Dependencies (if not already via Initializr):**
    Add the following to your `pom.xml` (Maven) or `build.gradle` (Gradle).

    **Maven (`pom.xml`):**
    ```xml
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version> </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    ```

* **Security Configuration (`SecurityConfig.java`)**: In `src/main/java/com/digitalinvitations/backend/config`.
    ```java
    package com.digitalinvitations.backend.config;

    import com.digitalinvitations.backend.security.JwtAuthenticationEntryPoint;
    import com.digitalinvitations.backend.security.JwtAuthenticationFilter;
    import com.digitalinvitations.backend.service.CustomUserDetailsService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
    import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
    import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

    @Configuration
    @EnableWebSecurity
    @EnableMethodSecurity(prePostEnabled = true) // Enable @PreAuthorize
    public class SecurityConfig {

        @Autowired
        private CustomUserDetailsService customUserDetailsService;

        @Autowired
        private JwtAuthenticationEntryPoint unauthorizedHandler;

        @Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter() {
            return new JwtAuthenticationFilter();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {
            DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
            authProvider.setUserDetailsService(customUserDetailsService);
            authProvider.setPasswordEncoder(passwordEncoder());
            return authProvider;
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
            return authConfig.getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                .cors().and() // Enable CORS. A separate CorsConfig class will be needed.
                .csrf().disable() // Disable CSRF for stateless APIs
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and() // Stateless session for JWT
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/api/auth/**").permitAll() // Allow auth endpoints
                    .requestMatchers("/api/invitations/public/**").permitAll() // Public invitations
                    .requestMatchers(HttpMethod.POST, "/api/invitations/{invitationId}/rsvps").permitAll() // Public RSVP
                    .requestMatchers("/h2-console/**").permitAll() // For H2 console, if used
                    .anyRequest().authenticated() // All other requests require authentication
                );

            http.authenticationProvider(authenticationProvider());
            http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

            return http.build();
        }
    }
    ```

* **Custom User Details Service (`CustomUserDetailsService.java`)**: In `src/main/java/com/digitalinvitations/backend/service`.
    ```java
    package com.digitalinvitations.backend.service;

    import com.digitalinvitations.backend.model.User;
    import com.digitalinvitations.backend.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.core.GrantedAuthority;
    import org.springframework.security.core.authority.SimpleGrantedAuthority;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.security.core.userdetails.UserDetailsService;
    import org.springframework.security.core.userdetails.UsernameNotFoundException;
    import org.springframework.stereotype.Service;

    import java.util.Collection;
    import java.util.Collections;

    @Service
    public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    mapRolesToAuthorities(user.getRole().name())
            );
        }

        private Collection<? extends GrantedAuthority> mapRolesToAuthorities(String role) {
            return Collections.singletonList(new SimpleGrantedAuthority(role));
        }
    }
    ```

* **JWT Utility Classes**: In `src/main/java/com/digitalinvitations/backend/security`.

    * **`JwtTokenProvider.java`**:
        ```java
        package com.digitalinvitations.backend.security;

        import io.jsonwebtoken.*;
        import io.jsonwebtoken.security.Keys;
        import org.springframework.beans.factory.annotation.Value;
        import org.springframework.security.core.Authentication;
        import org.springframework.stereotype.Component;

        import java.security.Key;
        import java.util.Date;

        @Component
        public class JwtTokenProvider {

            @Value("${app.jwtSecret}")
            private String jwtSecret;

            @Value("${app.jwtExpirationInMs}")
            private int jwtExpirationInMs;

            private Key key;

            // Initialize key from secret string
            public Key getSigningKey() {
                if (this.key == null) {
                    this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
                }
                return this.key;
            }

            public String generateToken(Authentication authentication) {
                org.springframework.security.core.userdetails.User userPrincipal =
                        (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

                Date now = new Date();
                Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

                // Add role to claims
                String role = authentication.getAuthorities().stream()
                                .findFirst()
                                .map(GrantedAuthority::getAuthority)
                                .orElse("CLIENT"); // Default role if not found

                return Jwts.builder()
                        .setSubject(userPrincipal.getUsername()) // email is the subject
                        .claim("role", role) // Add role as a claim
                        .setIssuedAt(new Date())
                        .setExpiration(expiryDate)
                        .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                        .compact();
            }

            public String getUsernameFromJWT(String token) {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getSigningKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                return claims.getSubject();
            }

            public String getRoleFromJWT(String token) {
                 Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getSigningKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                return claims.get("role", String.class);
            }


            public boolean validateToken(String authToken) {
                try {
                    Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
                    return true;
                } catch (SignatureException ex) {
                    // Invalid JWT signature
                } catch (MalformedJwtException ex) {
                    // Invalid JWT token
                } catch (ExpiredJwtException ex) {
                    // Expired JWT token
                } catch (UnsupportedJwtException ex) {
                    // Unsupported JWT token
                } catch (IllegalArgumentException ex) {
                    // JWT claims string is empty
                }
                return false;
            }
        }
        ```

    * **`JwtAuthenticationFilter.java`**:
        ```java
        package com.digitalinvitations.backend.security;

        import com.digitalinvitations.backend.service.CustomUserDetailsService;
        import jakarta.servlet.FilterChain;
        import jakarta.servlet.ServletException;
        import jakarta.servlet.http.HttpServletRequest;
        import jakarta.servlet.http.HttpServletResponse;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
        import org.springframework.security.core.context.SecurityContextHolder;
        import org.springframework.security.core.userdetails.UserDetails;
        import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
        import org.springframework.util.StringUtils;
        import org.springframework.web.filter.OncePerRequestFilter;

        import java.io.IOException;

        public class JwtAuthenticationFilter extends OncePerRequestFilter {

            @Autowired
            private JwtTokenProvider tokenProvider;

            @Autowired
            private CustomUserDetailsService customUserDetailsService;

            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                    throws ServletException, IOException {
                try {
                    String jwt = getJwtFromRequest(request);

                    if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                        String username = tokenProvider.getUsernameFromJWT(jwt);
                        // Optionally retrieve roles directly from token claims if performance is critical
                        // String role = tokenProvider.getRoleFromJWT(jwt);

                        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (Exception ex) {
                    logger.error("Could not set user authentication in security context", ex);
                }

                filterChain.doFilter(request, response);
            }

            private String getJwtFromRequest(HttpServletRequest request) {
                String bearerToken = request.getHeader("Authorization");
                if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                    return bearerToken.substring(7);
                }
                return null;
            }
        }
        ```

    * **`JwtAuthenticationEntryPoint.java`**:
        ```java
        package com.digitalinvitations.backend.security;

        import jakarta.servlet.ServletException;
        import jakarta.servlet.http.HttpServletRequest;
        import jakarta.servlet.http.HttpServletResponse;
        import org.springframework.security.core.AuthenticationException;
        import org.springframework.security.web.AuthenticationEntryPoint;
        import org.springframework.stereotype.Component;

        import java.io.IOException;

        @Component
        public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

            @Override
            public void commence(HttpServletRequest httpServletRequest,
                                 HttpServletResponse httpServletResponse,
                                 AuthenticationException e) throws IOException, ServletException {
                httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            }
        }
        ```

* **Authentication Controller (`AuthController.java`)**: In `src/main/java/com/digitalinvitations/backend/controller`.
    ```java
    package com.digitalinvitations.backend.controller;

    import com.digitalinvitations.backend.model.User;
    import com.digitalinvitations.backend.model.User.Role;
    import com.digitalinvitations.backend.payload.AuthResponse;
    import com.digitalinvitations.backend.payload.LoginRequest;
    import com.digitalinvitations.backend.payload.SignUpRequest;
    import com.digitalinvitations.backend.security.JwtTokenProvider;
    import com.digitalinvitations.backend.service.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

    import java.net.URI;
    import java.util.Optional;

    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private UserRepository userRepository; // Direct access for user existence check
        @Autowired
        private UserService userService; // Use service for saving (hashing password)

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtTokenProvider tokenProvider;

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            // Retrieve actual user from DB to get their ID and Role
            User user = userRepository.findByEmail(loginRequest.getEmail())
                                     .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getRole().name()));
        }

        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
            if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
                return new ResponseEntity<>("Email address already in use!", HttpStatus.BAD_REQUEST);
            }

            // Create user (default to CLIENT role for signups)
            User user = new User();
            user.setName(signUpRequest.getName());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(signUpRequest.getPassword()); // Password will be encoded by UserService
            user.setRole(Role.CLIENT); // Default role for new signups

            User result = userService.saveUser(user); // Use UserService to hash password

            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/api/users/{id}")
                    .buildAndExpand(result.getId()).toUri();

            return ResponseEntity.created(location).body("User registered successfully!");
        }
    }
    ```

* **Auth Request/Response Payloads**: In `src/main/java/com/digitalinvitations/backend/payload`.

    * **`LoginRequest.java`**:
        ```java
        package com.digitalinvitations.backend.payload;

        import lombok.Data;

        @Data
        public class LoginRequest {
            private String email;
            private String password;
        }
        ```

    * **`SignUpRequest.java`**:
        ```java
        package com.digitalinvitations.backend.payload;

        import lombok.Data;

        @Data
        public class SignUpRequest {
            private String name;
            private String email;
            private String password;
            // No role here, as it's assigned by backend for signup
        }
        ```

    * **`AuthResponse.java`**:
        ```java
        package com.digitalinvitations.backend.payload;

        import lombok.AllArgsConstructor;
        import lombok.Data;

        @Data
        @AllArgsConstructor
        public class AuthResponse {
            private String accessToken;
            private Long userId;
            private String role;
            private String tokenType = "Bearer";

            public AuthResponse(String accessToken, Long userId, String role) {
                this.accessToken = accessToken;
                this.userId = userId;
                this.role = role;
            }
        }
        ```

## 8. Configure CORS

Add a CORS configuration to allow your Angular frontend to communicate with the Spring Boot backend.

* **`CorsConfig.java`**: In `src/main/java/com/digitalinvitations/backend/config`.
    ```java
    package com.digitalinvitations.backend.config;

    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.servlet.config.annotation.CorsRegistry;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    @Configuration
    public class CorsConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**") // Apply to all endpoints
                    .allowedOrigins("http://localhost:4200") // Allow your Angular app's origin
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    }
    ```

## 9. Add Test Data (Optional, for Development)

You can use `CommandLineRunner` to insert some initial data when the application starts.

* **`DataInitializer.java`**: In `src/main/java/com/digitalinvitations.backend`.
    ```java
    package com.digitalinvitations.backend;

    import com.digitalinvitations.backend.model.Invitation;
    import com.digitalinvitations.backend.model.Rsvp;
    import com.digitalinvitations.backend.model.Template;
    import com.digitalinvitations.backend.model.User;
    import com.digitalinvitations.backend.repository.InvitationRepository;
    import com.digitalinvitations.backend.repository.RsvpRepository;
    import com.digitalinvitations.backend.repository.TemplateRepository;
    import com.digitalinvitations.backend.repository.UserRepository;
    import org.springframework.boot.CommandLineRunner;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import com.fasterxml.jackson.databind.ObjectMapper;

    import java.time.LocalDateTime;
    import java.util.Arrays;
    import java.util.HashMap;
    import java.util.Map;

    @Configuration
    public class DataInitializer {

        @Bean
        CommandLineRunner initDatabase(UserRepository userRepository,
                                       TemplateRepository templateRepository,
                                       InvitationRepository invitationRepository,
                                       RsvpRepository rsvpRepository,
                                       PasswordEncoder passwordEncoder) {
            return args -> {
                // Clear existing data for fresh start (development only)
                rsvpRepository.deleteAll();
                invitationRepository.deleteAll();
                userRepository.deleteAll(); // Delete users last due to foreign key constraints
                templateRepository.deleteAll();


                // 1. Create Users
                User admin = new User(null, "Admin User", "admin@demo.com", passwordEncoder.encode("password"), User.Role.ADMIN);
                User builder = new User(null, "Builder User", "builder@demo.com", passwordEncoder.encode("password"), User.Role.BUILDER);
                User client = new User(null, "Client User", "client@demo.com", passwordEncoder.encode("password"), User.Role.CLIENT);

                userRepository.saveAll(Arrays.asList(admin, builder, client));

                // 2. Create Templates
                Template weddingTemplate = new Template(null, "Elegant Wedding", "wedding", "url1");
                Template birthdayTemplate = new Template(null, "Kids Birthday Party", "birthday", "url2");
                templateRepository.saveAll(Arrays.asList(weddingTemplate, birthdayTemplate));

                // 3. Create Invitations
                ObjectMapper objectMapper = new ObjectMapper(); // For converting map to JSON string
                Map<String, Object> weddingContent = new HashMap<>();
                weddingContent.put("eventDate", "2025-12-15");
                weddingContent.put("location", "Salón Jardín Encanto");
                weddingContent.put("names", "Ana & Luis");
                weddingContent.put("gallery", Arrays.asList("img1.jpg", "img2.jpg"));
                weddingContent.put("rsvpEnabled", true);

                Invitation weddingInvitation = new Invitation(
                    null, client, weddingTemplate, builder, "boda-ana-y-luis",
                    Invitation.InvitationStatus.PUBLISHED,
                    objectMapper.writeValueAsString(weddingContent), // Convert map to JSON string
                    LocalDateTime.now(), LocalDateTime.now()
                );
                invitationRepository.save(weddingInvitation);

                Map<String, Object> birthdayContent = new HashMap<>();
                birthdayContent.put("eventDate", "2025-08-20");
                birthdayContent.put("location", "Casa de los Sueños");
                birthdayContent.put("names", "Fiesta de Cumpleaños de Sofía");
                birthdayContent.put("age", 5);
                birthdayContent.put("rsvpEnabled", true);
                birthdayContent.put("dressCode", "Casual");

                Invitation birthdayInvitation = new Invitation(
                    null, client, birthdayTemplate, builder, "cumple-sofia",
                    Invitation.InvitationStatus.PENDING_BUILDER_REVIEW,
                    objectMapper.writeValueAsString(birthdayContent),
                    LocalDateTime.now(), LocalDateTime.now()
                );
                invitationRepository.save(birthdayInvitation);


                // 4. Create RSVPs
                Rsvp rsvp1 = new Rsvp(null, weddingInvitation, "Carlos", Rsvp.RsvpResponse.YES, "¡Nos vemos allá!", LocalDateTime.now());
                Rsvp rsvp2 = new Rsvp(null, weddingInvitation, "Maria", Rsvp.RsvpResponse.NO, "Lamentablemente no podremos asistir.", LocalDateTime.now());
                rsvpRepository.saveAll(Arrays.asList(rsvp1, rsvp2));

                System.out.println("Database initialized with sample data.");
            };
        }
    }
    ```

* **Add Jackson Databind for JSON processing in DataInitializer:**
    **Maven (`pom.xml`):**
    ```xml
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
    ```

---