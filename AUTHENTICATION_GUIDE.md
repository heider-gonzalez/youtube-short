# 🔐 Guía de Autenticación con YouTube

Esta guía te explica paso a paso cómo conectar el sistema de automatización a tu cuenta personal de YouTube para que pueda acceder a tus métricas y subir contenido.

## 📋 Requisitos Previos

- Cuenta de Google con canal de YouTube
- Acceso a [Google Cloud Console](https://console.cloud.google.com)
- Node.js instalado (para el script helper)

## 🚀 Proceso de Autenticación (3 métodos)

### Método 1: Vía Web Dashboard (Recomendado)

#### Paso 1: Configurar Google Cloud Console

1. **Crear Proyecto**
   - Ve a [console.cloud.google.com](https://console.cloud.google.com)
   - Crea un nuevo proyecto: "YouTube Automation System"

2. **Habilitar APIs**
   - Ve a "APIs & Services" > "Library"
   - Busca y habilita:
     - YouTube Data API v3
     - YouTube Analytics API

3. **Configurar OAuth Consent Screen**
   - Ve a "APIs & Services" > "OAuth consent screen"
   - Selecciona "External"
   - Completa la información básica
   - En "Scopes", añade:
     ```
     https://www.googleapis.com/auth/youtube.upload
     https://www.googleapis.com/auth/youtube.readonly
     https://www.googleapis.com/auth/yt-analytics.readonly
     ```

4. **Crear Credenciales**
   - Ve a "APIs & Services" > "Credentials"
   - "Create Credentials" > "OAuth client ID"
   - Tipo: "Web application"
   - Authorized redirect URIs:
     ```
     http://localhost:3000/oauth/callback
     http://localhost:3001/oauth/callback
     ```
   - Guarda el **Client ID** y **Client Secret**

#### Paso 2: Configurar el Sistema

1. **Actualizar archivo .env**
   ```bash
   # Copia el template
   cp .env.example .env
   
   # Edita .env con tus credenciales
   YOUTUBE_CLIENT_ID=tu_client_id_aqui
   YOUTUBE_CLIENT_SECRET=tu_client_secret_aqui
   ```

2. **Iniciar el sistema**
   ```bash
   # Terminal 1: Backend Python
   cd backend-python
   python src/main.py

   # Terminal 2: Backend Node.js
   cd backend-nodejs
   npm start

   # Terminal 3: Frontend
   cd frontend/youtube-automation-dashboard
   npm run dev
   ```

#### Paso 3: Conectar tu Cuenta

1. Abre el dashboard en `http://localhost:3000`
2. Ve a "Canales"
3. Haz clic en "Conectar Canal"
4. Sigue el asistente de autenticación:
   - El sistema generará una URL de autorización
   - Abre la URL en tu navegador
   - Inicia sesión con tu cuenta de Google
   - Autoriza la aplicación
   - Copia el código de autorización
   - Pega el código en el sistema
5. ¡Listo! Tu cuenta está conectada

### Método 2: Vía Línea de Comandos

Usa el script helper incluido en el backend:

```bash
cd backend-nodejs

# 1. Generar URL de autorización
node src/scripts/auth-helper.js auth-url

# 2. Abre la URL en tu navegador, autoriza y copia el código

# 3. Intercambiar código por tokens
node src/scripts/auth-helper.js exchange <codigo_autorizacion>
```

El script te mostrará los tokens que debes guardar en tu base de datos.

### Método 3: Manual (Direct API)

Si prefieres hacerlo manualmente:

1. **Generar URL manualmente**
   ```
   https://accounts.google.com/o/oauth2/v2/auth?
   client_id=TU_CLIENT_ID&
   redirect_uri=http://localhost:3000/oauth/callback&
   scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly&
   response_type=code&
   access_type=offline&
   prompt=consent
   ```

2. **Intercambiar código por tokens**
   - Usa el endpoint OAuth de Google
   - O implementa el intercambio en tu backend

## 🔧 Configuración de Backends

### Backend Python (IA)
```python
# Ya está configurado en el código
# Los tokens se gestionan vía backend Node.js
```

### Backend Node.js (YouTube API)
```javascript
// El servicio youtubeService ya maneja la autenticación
// Los tokens se guardan en la base de datos
// Se refrescan automáticamente cuando expiran
```

## 📊 Qué Permisos Otorgas

Al autorizar la aplicación, otorgas acceso a:

✅ **Subir videos** a tu canal  
✅ **Leer estadísticas** del canal  
✅ **Acceder a analytics** detallados  
✅ **Gestionar playlists** y contenido  
✅ **Obtener información** del canal  

## 🔒 Seguridad

- Los tokens se guardan encriptados en la base de datos
- Los refresh tokens permiten renovar access tokens sin re-autenticar
- Puedes revocar el acceso en cualquier momento desde Google Account
- El sistema respeta los límites de cuota de YouTube API

## 🛠️ Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que el redirect URI en Google Console coincida exactamente
- Incluye http://localhost:3000/oauth/callback

### Error: "access_denied"
- Verifica que el OAuth consent screen esté configurado correctamente
- Asegúrate de que los scopes estén añadidos

### Error: "invalid_client"
- Verifica que el Client ID y Client Secret sean correctos
- Copia los valores exactos de Google Console

### Tokens expirados
- El sistema refresca tokens automáticamente
- Si falla, usa el script helper: `node auth-helper.js refresh <refresh_token>`

## 📱 Proceso en el Dashboard

1. **Inicio**: Usuario hace clic en "Conectar Canal"
2. **Generación URL**: Sistema genera URL de autorización OAuth
3. **Autorización**: Usuario abre URL, inicia sesión, autoriza
4. **Código**: Google redirige con código de autorización
5. **Intercambio**: Backend intercambia código por tokens
6. **Guardado**: Tokens se guardan en base de datos
7. **Verificación**: Sistema verifica acceso al canal
8. **Éxito**: Canal aparece en la lista de canales conectados

## 🎯 Siguiente Pasos

Una vez conectada tu cuenta:

1. **Crear primera campaña** en el dashboard
2. **Configurar nicho** y estilo de contenido
3. **Generar primer video** con IA
4. **Revisar analytics** para optimizar
5. **Escalar** con más canales y campañas

## 📞 Soporte

Si tienes problemas:

1. Verifica que las credenciales en `.env` sean correctas
2. Revisa la configuración en Google Cloud Console
3. Consulta los logs en `logs/combined.log`
4. Usa el script helper para debuggear

---

**Recuerda**: Mantén tus credenciales seguras. Nunca compartas tu Client Secret ni tokens con terceros.
