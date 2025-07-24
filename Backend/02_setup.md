# Guía de Implementación del Backend para Integración con el Frontend

Este documento describe los requisitos críticos y los puntos de conexión que el backend (a ser construido con Spring Boot) debe implementar para asegurar una integración perfecta con la aplicación frontend de Angular ya desarrollada.

El frontend espera que el backend se adhiera a los siguientes contratos de API, especialmente en lo que respecta a la autenticación, los endpoints y las estructuras de datos.

---

## 1. Configuración de CORS

Es fundamental que el backend permita peticiones desde el servidor de desarrollo de Angular.

-   **Origen Permitido**: `http://localhost:4200`

---

## 2. Flujo de Autenticación y JWT

El `AuthService` del frontend está diseñado para manejar un flujo de autenticación específico.

### Endpoint de Login: `POST /api/auth/login`

-   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "user_password"
    }
    ```
-   **Response Body (en caso de éxito)**:
    **¡CRÍTICO!** La respuesta de un login exitoso **debe** tener la siguiente estructura exacta. El frontend fue optimizado para recibir el nombre, email y rol del usuario directamente en esta respuesta para evitar llamadas adicionales a la API y mejorar el rendimiento.

    ```json
    {
      "accessToken": "ey...",
      "tokenType": "Bearer",
      "userId": 1,
      "name": "Joshua Hernandez",
      "email": "joshua@example.com",
      "role": "CLIENT"
    }
    ```
    Donde `role` puede ser `'ADMIN'`, `'BUILDER'`, o `'CLIENT'`.

### Endpoint de Registro: `POST /api/auth/signup`

-   **Request Body**:
    ```json
    {
      "name": "New User",
      "email": "new@example.com",
      "password": "secure_password"
    }
    ```
-   **Response Body (en caso de éxito)**: Un status `200 OK` o `201 Created` es suficiente. El frontend redirigirá al usuario a la página de login.

---

## 3. Endpoints de la API y Modelos de Datos (DTOs)

El backend debe implementar los siguientes endpoints. La estructura de los objetos JSON (DTOs) en las respuestas debe coincidir con las interfaces TypeScript definidas en `Frontend/digital-invitations-frontend/src/app/core/models/`.

### `UserService` (Prefijo: `/api/users`)

-   `GET /`: Retorna `User[]`.
-   `GET /{id}`: Retorna `User`.
-   `POST /`: Recibe `User`, retorna `User`.
-   `PUT /{id}`: Recibe `User`, retorna `User`.
-   `DELETE /{id}`: No retorna contenido.

### `TemplateService` (Prefijo: `/api/templates`)

-   `GET /`: Retorna `Template[]`.
-   `GET /{id}`: Retorna `Template`.
-   ... (y el resto de los endpoints CRUD).

### `InvitationService` (Prefijo: `/api/invitations`)

Este servicio es más complejo y contiene múltiples endpoints para diferentes roles.

-   `GET /public/{slug}`: Endpoint público, retorna `Invitation`.
-   `GET /`: (Admin) Retorna `Invitation[]`.
-   `GET /client/{clientId}`: Retorna `Invitation[]` para un cliente.
-   `GET /builder/{builderId}`: Retorna `Invitation[]` para un builder.
-   `POST /`: Para crear una invitación. Recibe `clientId` y `templateId` como `request params` y el `content` en el body.
-   `POST /{invitationId}/rsvps`: Para que un invitado confirme asistencia. Recibe un `Rsvp` en el body.
-   `GET /{invitationId}/rsvps`: Retorna los `Rsvp[]` para una invitación.

**Nota Importante**: Para una lista exhaustiva de todos los métodos y sus parámetros esperados, se recomienda revisar los archivos de servicio correspondientes en la carpeta `Frontend/digital-invitations-frontend/src/app/core/services/`. 