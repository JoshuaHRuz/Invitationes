# Guía Mejorada y Detallada para Configurar el Backend de Invitaciones Digitales (READMEGrok)

Esta guía mejora el contenido de README28.md, incorporando la estructura y componentes principales del frontend (ubicado en `Frontend/digital-invitations-frontend/src/app/`) para alinear mejor los endpoints del backend con las funcionalidades del frontend en Angular. El objetivo es facilitar la integración entre frontend y backend, haciendo énfasis en cómo los endpoints soportan módulos como `auth`, `builder-dashboard`, `client-dashboard`, `invitations`, etc. 

La guía está diseñada para ser utilizada por una IA (como Grok) para construir el backend paso a paso de manera específica y secuencial. Cada paso incluye: 
- **Objetivo**: Qué se logra.
- **Requisitos previos**: Dependencias o configuraciones necesarias.
- **Instrucciones detalladas**: Acciones específicas, código de ejemplo y pruebas.
- **Integración con Frontend**: Cómo se conecta con componentes del frontend.
- **Posibles errores y soluciones**: Para depuración.

Se asume un stack de backend como Node.js con Express, MongoDB (o similar), JWT para autenticación, y herramientas como bcrypt para hashing. Instala dependencias iniciales: `npm init -y; npm i express mongoose jsonwebtoken bcryptjs dotenv cors`.

---

## Estructura General del Proyecto
- **Backend Directory**: Crea una carpeta `Backend/` en la raíz del proyecto (`Invitationes/`). Dentro de ella, organiza en subcarpetas: `models/`, `routes/`, `controllers/`, `middlewares/`, `config/`.
- **Frontend Integración**: El frontend en `Frontend/digital-invitations-frontend/src/app/` tiene módulos como:
  - `auth/` (login, register, forgot-password).
  - `builder-dashboard/` (edición de invitaciones).
  - `client-dashboard/` (selección de templates, formularios).
  - `invitations/` (componentes como countdown, rsvp-form, etc.).
  - `admin-dashboard/` (estadísticas, gestión de usuarios).
  Los endpoints deben mapearse directamente a estos para llamadas API desde servicios como `invitation-data.service.ts` o `music.service.ts`.

## Paso 1: Configuración Inicial del Servidor y Base de Datos
**Objetivo**: Configurar el servidor Express y conectar a la base de datos.
**Requisitos previos**: Node.js instalado, crea `.env` con `PORT=3000`, `MONGO_URI=mongodb://localhost/invitaciones`, `JWT_SECRET=tu_secreto`.
**Instrucciones detalladas**:
1. Crea `Backend/server.js`: 
   ```
   const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   app.use(express.json());
   app.use(cors());

   mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log('DB conectada'))
     .catch(err => console.error(err));

   // Importa rutas aquí más adelante
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
   ```
2. Prueba: `node server.js`. Verifica conexión a DB.
**Integración con Frontend**: Soporta llamadas desde `app/core/services/` como `invitation-data.service.ts` para fetching data.
**Posibles errores**: Error de conexión DB → Verifica MONGO_URI.

## Paso 2: Definir Esquema de Base de Datos (Mejorado con Frontend Mapping)
**Objetivo**: Crear modelos que alineen con datos usados en frontend (e.g., `invitation.model.ts`).
**Requisitos previos**: Paso 1 completado.
**Instrucciones detalladas**:
1. En `Backend/models/`, crea `User.js`, `Invitation.js`, `GuestGroup.js`, `Attendee.js`, etc., basados en README28.md pero mapeados a frontend.
   Ejemplo `Invitation.js`:
   ```
   const mongoose = require('mongoose');
   const invitationSchema = new mongoose.Schema({
     host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     event_name: String,
     // Otros campos alineados con frontend/components como event-details, itinerary
   });
   module.exports = mongoose.model('Invitation', invitationSchema);
   ```
2. Define relaciones: `GuestGroup` referencia `Invitation`, etc.
**Integración con Frontend**: Coincide con `core/models/invitation.model.ts` para datos en `invitations/components/` como `rsvp-form.component.ts`.
**Posibles errores**: Campos faltantes → Compara con frontend models.

## Paso 3: Implementar Autenticación (Login con JWT)
**Objetivo**: Manejar login, alineado con `auth/` module del frontend.
**Requisitos previos**: Modelos definidos.
**Instrucciones detalladas**:
1. Crea middleware `auth.js` en `middlewares/` para verificar JWT.
2. En `controllers/authController.js`:
   ```
   const jwt = require('jsonwebtoken');
   const bcrypt = require('bcryptjs');
   const User = require('../models/User');

   exports.login = async (req, res) => {
     const { email, password } = req.body;
     // Lógica detallada de README28.md
     // ...
   };
   ```
3. Ruta en `routes/auth.js`: `router.post('/login', authController.login);`.
4. Importa en `server.js`.
**Integración con Frontend**: Usado en `auth/login/login.component.ts` para almacenar token en localStorage.
**Posibles errores**: Token inválido → Verifica JWT_SECRET.

## Paso 4: Endpoints para Invitaciones (Creación y Gestión)
**Objetivo**: Soporte para `builder-dashboard/` y `invitations/`.
**Requisitos previos**: Autenticación.
**Instrucciones detalladas**:
1. Controlador para `POST /api/invitations` con middleware de auth.
2. Implementa lógica de creación, validación como en README28.md.
**Integración con Frontend**: Llamado desde `builder-dashboard/invitation-editor/invitation-editor.ts` para guardar invitaciones.
**Posibles errores**: Autorización fallida → Chequea middleware.

## Paso 5: Gestión de Invitados y RSVP
**Objetivo**: Endpoints para listas y confirmaciones, alineados con `rsvp-form/`.
**Requisitos previos**: Invitaciones.
**Instrucciones detalladas**:
1. `POST /api/invitations/{id}/guest-groups` con transacciones.
2. `POST /api/guest-groups/{id}/confirm` para RSVP.
**Integración con Frontend**: Usado en `invitations/components/rsvp-form/rsvp-form.component.ts` y `public-viewer/rsvp-form/`.
**Posibles errores**: Exceso de asistentes → Valida allowed_passes.

## Paso 6: Endpoints Públicos para Visualización
**Objetivo**: Soporte para `public-viewer/` y `invitations/`.
**Instrucciones detalladas**:
1. `GET /api/invitations/{id}` y `GET /api/guest-groups/{id}`.
**Integración con Frontend**: Fetch en `public-invitation-viewer/public-invitation-viewer.ts`.

## Paso 7: Testing y Despliegue
**Objetivo**: Asegurar funcionalidad.
**Instrucciones detalladas**: Usa Postman para testear endpoints. Despliega en Vercel/Heroku, configura CORS para frontend.

Esta guía permite a una IA construir el backend secuencialmente, asegurando integración con el frontend Angular. 