# Guía Detallada del Backend para Invitaciones Digitales

Este documento sirve como un "blueprint" técnico para el desarrollo del servidor backend. Describe en detalle el flujo de la aplicación, la arquitectura de la API, el esquema de la base de datos y la lógica de negocio, desde la autenticación del anfitrión hasta la confirmación del invitado.

---

## Orden del Flujo de la Aplicación

1.  **Flujo del Anfitrión (Cliente):**
    *   Autenticación y Gestión de Sesión (Login con JWT).
    *   Creación y Configuración de una Invitación.
    *   Gestión de la Lista de Invitados.
    *   Monitorización de Confirmaciones.
2.  **Flujo del Invitado:**
    *   Recepción y Visualización de la Invitación.
    *   Confirmación de Asistencia (RSVP).

---

## Parte 1: Flujo del Anfitrión (Cliente)

### **Paso 1.1: Autenticación y Gestión de Sesión (Login con JWT)**

El anfitrión debe estar autenticado para acceder al panel de administración y gestionar sus eventos.

#### **Endpoint: `POST /api/auth/login`**

-   **Propósito:** Autenticar a un anfitrión y devolver un token de sesión.
-   **Cuerpo de la Solicitud (Request Body):**
    ```json
    {
      "email": "anfitrion@ejemplo.com",
      "password": "password123"
    }
    ```
-   **Lógica del Backend:**
    1.  **Validación de Entrada:** Verificar que `email` y `password` no estén vacíos y tengan un formato válido.
    2.  **Búsqueda de Usuario:** Buscar en la tabla `Users` un registro que coincida con el `email` proporcionado.
    3.  **Manejo de Errores (Usuario no encontrado):** Si no se encuentra ningún usuario, devolver una respuesta `401 Unauthorized` con un mensaje genérico (`"Credenciales inválidas"`).
    4.  **Verificación de Contraseña:** Si se encuentra el usuario, comparar la `password` proporcionada con el `password_hash` almacenado en la base de datos. Utilizar una librería segura como `bcrypt` para esta comparación.
    5.  **Manejo de Errores (Contraseña incorrecta):** Si la contraseña no coincide, devolver `401 Unauthorized`.
    6.  **Generación de JWT:** Si la contraseña es correcta, crear un payload para el JWT que incluya datos no sensibles pero útiles, como el `user_id` y el `email`. Establecer una fecha de expiración (ej. "7d" para 7 días).
    7.  **Firma del Token:** Firmar el token utilizando una clave secreta (`JWT_SECRET`) almacenada de forma segura en las variables de entorno del servidor.
-   **Respuesta Exitosa (Código `200 OK`):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "7d",
      "user": {
        "id": "user_uuid_123",
        "name": "Nombre del Anfitrión"
      }
    }
    ```
-   **Uso en el Frontend:** El cliente de Angular debe almacenar este `token` (ej. en `localStorage`) y adjuntarlo en la cabecera `Authorization` de todas las solicitudes a rutas protegidas (`Authorization: Bearer {token}`).

### **Paso 1.2: Creación y Configuración de una Invitación**

Una vez logueado, el anfitrión puede crear y personalizar su evento.

#### **Endpoint: `POST /api/invitations` (Ruta Protegida)**

-   **Propósito:** Crear una nueva invitación.
-   **Middleware de Autenticación:** Antes de llegar a la lógica principal, un middleware debe:
    1.  Extraer el token JWT de la cabecera `Authorization`.
    2.  Verificar que el token sea válido y no haya expirado.
    3.  Si es válido, decodificarlo para obtener el `user_id` del anfitrión.
    4.  Adjuntar el `user_id` al objeto de la solicitud (ej. `req.user.id`) para que la lógica posterior sepa quién está haciendo la solicitud.
-   **Cuerpo de la Solicitud (Request Body):** Un objeto JSON que contiene todos los detalles de la invitación, excepto la lista de invitados. La estructura debe coincidir con el modelo de datos.
-   **Lógica del Backend:**
    1.  Obtener el `host_id` del objeto `req.user` inyectado por el middleware.
    2.  Validar los datos recibidos (ej. asegurar que las fechas sean válidas, los nombres no estén vacíos, etc.).
    3.  Crear un nuevo registro en la tabla `Invitations`, asociándolo con el `host_id`.
    4.  Crear registros en las tablas relacionadas (`Events`, `ItineraryItems`, `GalleryPhotos`, etc.), vinculándolos con el `invitation_id` recién creado.
-   **Respuesta Exitosa (Código `201 Created`):**
    ```json
    {
      "message": "Invitación creada exitosamente",
      "invitationId": "invitation_uuid_abc"
    }
    ```

### **Paso 1.3: Gestión de la Lista de Invitados**

El anfitrión necesita subir la lista de personas a las que invitará.

#### **Endpoint: `POST /api/invitations/{invitationId}/guest-groups` (Ruta Protegida)**

-   **Propósito:** Añadir una lista de grupos de invitados a una invitación existente.
-   **Middleware de Autenticación y Autorización:**
    1.  Verificar el JWT (autenticación).
    2.  Verificar que el `user_id` del token sea el dueño de la `invitationId` que se está intentando modificar (autorización). Esto evita que un anfitrión modifique las listas de otro.
-   **Cuerpo de la Solicitud (Request Body):** Un array de objetos, donde cada objeto representa un grupo de invitados.
    ```json
    [
      { "groupName": "Familia Pérez", "whatsappNumber": "+5215512345678", "allowedPasses": 4 },
      { "groupName": "Juan González", "whatsappNumber": "+5213387654321", "allowedPasses": 2 }
    ]
    ```
-   **Lógica del Backend:**
    1.  Iniciar una transacción de base de datos para asegurar la integridad (si falla un invitado, fallan todos).
    2.  Recorrer el array de grupos de invitados.
    3.  Para cada grupo, crear un nuevo registro en la tabla `GuestGroups`, asegurándose de vincularlo con el `invitationId` correcto.
    4.  Si todos los registros se insertan correctamente, confirmar la transacción.
-   **Respuesta Exitosa (Código `200 OK`):**
    ```json
    {
      "message": "Lista de invitados actualizada exitosamente. Se añadieron 2 grupos."
    }
    ```

---

## Parte 2: Flujo del Invitado

### **Paso 2.1: Visualización de la Invitación**

El invitado recibe un enlace único y accede a la invitación.

#### **Endpoints Involucrados (Públicos):**

1.  **`GET /api/invitations/{invitationId}`:**
    -   **Propósito:** Obtener los datos generales y visuales de la invitación.
    -   **Lógica:** Buscar en la tabla `Invitations` y hacer `JOIN` con todas sus tablas relacionadas (`Events`, `ItineraryItems`, etc.) para construir el objeto JSON completo.
2.  **`GET /api/guest-groups/{groupId}`:**
    -   **Propósito:** Obtener los detalles específicos de este grupo de invitados para personalizar la experiencia.
    -   **Lógica:** Buscar en la tabla `GuestGroups` el registro que coincida con el `groupId`.
    -   **Respuesta Exitosa (Código `200 OK`):**
        ```json
        {
          "groupName": "Familia Pérez",
          "allowedPasses": 4,
          "status": "PENDING"
        }
        ```

### **Paso 2.2: Confirmación de Asistencia (RSVP)**

El invitado llena el formulario de confirmación.

#### **Endpoint: `POST /api/guest-groups/{groupId}/confirm`**

-   **Propósito:** Registrar la respuesta de un grupo de invitados. Es una ruta pública, ya que el invitado no tiene cuenta, pero está "protegida" por la unicidad del `groupId`.
-   **Cuerpo de la Solicitud (Request Body):**
    ```json
    {
      "attendees": [
        { "name": "Juan Pérez", "status": "ATTENDING" },
        { "name": "Ana Pérez", "status": "ATTENDING" },
        { "name": "Niño Pérez", "status": "NOT_ATTENDING" }
      ],
      "message": "¡Felicidades, allá nos vemos!"
    }
    ```
-   **Lógica del Backend:**
    1.  **Búsqueda:** Encontrar el `GuestGroup` correspondiente al `groupId`.
    2.  **Validación:** Verificar que el número de `attendees` en la solicitud no exceda el campo `allowed_passes` del `GuestGroup`. Si lo excede, devolver `400 Bad Request`.
    3.  **Transacción de Base de Datos:**
        a.  Actualizar el `status` del `GuestGroup` a `CONFIRMED`.
        b.  Si el `message` no es nulo, guardarlo en el `GuestGroup`.
        c.  **Importante:** Eliminar cualquier registro existente en la tabla `Attendees` que esté asociado a este `groupId`. Esto permite que un invitado pueda cambiar su respuesta.
        d.  Recorrer el array `attendees` de la solicitud y crear un nuevo registro en la tabla `Attendees` para cada uno, vinculándolo con el `groupId`.
    4.  **Confirmar la Transacción.**
-   **Respuesta Exitosa (Código `200 OK`):**
    ```json
    {
      "message": "¡Gracias por tu confirmación!"
    }
    ```

---

## Anexo: Esquema de Base de Datos

(El esquema de base de datos detallado en el paso 2 de este documento se mantiene aquí). 