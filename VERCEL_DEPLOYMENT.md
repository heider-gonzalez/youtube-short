# 🚀 Guía de Despliegue en Vercel

## 📋 Paso 1: Preparar el Proyecto para Vercel

### **1.1 Estructura del Proyecto**
Vercel necesita detectar automáticamente que es un proyecto Vite + React. Asegúrate de tener esta estructura:

```
youtube-short/
├── frontend/youtube-automation-dashboard/  ← Directorio principal para Vercel
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
└── (otros directorios del backend)
```

### **1.2 Ajustar vite.config.ts**
Vercel necesita saber la configuración correcta:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 📋 Paso 2: Desplegar en Vercel

### **Opción A: Via GitHub (Recomendada)**

1. **Asegúrate de que tu repositorio esté en GitHub**
   - Ya está subido: https://github.com/heider-gonzalez/youtube-short

2. **Ve a Vercel.com**
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "Add New Project"

3. **Importa tu repositorio**
   - Selecciona: `heider-gonzalez/youtube-short`
   - Vercel detectará automáticamente que es un proyecto Vite

4. **Configura el Project Settings**
   ```
   Project Name: youtube-automation
   Framework Preset: Vite (detectado automáticamente)
   Root Directory: ./frontend/youtube-automation-dashboard
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Variables de Entorno**
   Añade estas variables:
   ```
   VITE_PYTHON_API_URL=https://tu-backend-api.com
   VITE_NODE_API_URL=https://tu-backend-api.com
   ```

6. **Deploy**
   - Haz clic en "Deploy"
   - Espera unos minutos
   - Vercel te dará una URL como: `https://youtube-automation.vercel.app`

### **Opción B: Via Vercel CLI**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Iniciar sesión
vercel login

# 3. Desplegar desde el directorio del frontend
cd frontend/youtube-automation-dashboard
vercel

# 4. Seguir las instrucciones
# - Project name: youtube-automation
# - Link to existing project: No
# - Directory: . (directorio actual)
```

## 📋 Paso 3: Configurar el Backend (Opcional)

Si quieres desplegar también los backends, tienes varias opciones:

### **Opción 1: Vercel Serverless Functions**
```javascript
// api/youtube.js
export default function handler(req, res) {
  // Tu lógica de backend aquí
  res.status(200).json({ message: 'Hello from Vercel' });
}
```

### **Opción 2: Railway/Render/Heroku**
- Despliega el backend Node.js en Railway
- Despliega el backend Python en Render
- Actualiza las URLs en Vercel

### **Opción 3: Mantener Backend Local**
- Usa ngrok para exponer tu backend local
- Configura Vercel para apuntar a tu backend local

## 📋 Paso 4: Actualizar el Frontend para Producción

### **4.1 Configurar URLs de Producción**
```typescript
// src/services/api.ts
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'https://tu-backend-python.vercel.app';
const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || 'https://tu-backend-node.vercel.app';
```

### **4.2 Manejar CORS**
Asegúrate de que tus backends permitan requests desde tu dominio de Vercel.

## 📋 Paso 5: Dominio Personalizado (Opcional)

1. **En Vercel Dashboard**
   - Ve a Settings > Domains
   - Añade tu dominio personalizado
   - Configura los DNS records

## 🎯 Selección en Vercel - Qué Elegir

Cuando importes tu proyecto en Vercel, verás estas opciones:

### **Framework Preset:**
- **Selecciona**: "Vite" (Vercel lo detectará automáticamente)
- **Si no lo detecta**: Selecciona "Other" y configura manualmente

### **Root Directory:**
- **Selecciona**: `./frontend/youtube-automation-dashboard`
- **Por qué**: Vercel necesita saber dónde está el package.json principal

### **Build Command:**
- **Automático**: `npm run build` (Vercel lo detectará)
- **Manual**: `npm run build`

### **Output Directory:**
- **Automático**: `dist` (Vercel lo detectará para Vite)
- **Manual**: `dist`

### **Install Command:**
- **Automático**: `npm install` (Vercel lo detectará)
- **Manual**: `npm install`

## 🔧 Solución de Problemas Comunes

### **Error: "Cannot find module"**
```bash
# Asegúrate de que node_modules esté en .gitignore
# Vercel instalará las dependencias automáticamente
```

### **Error: "Build failed"**
```bash
# Verifica que el build funcione localmente:
cd frontend/youtube-automation-dashboard
npm run build
npm run preview
```

### **Error: "Blank page"**
```bash
# Verifica que index.html tenga el div con id="root"
# Verifica que main.tsx monte el componente correctamente
```

## 📊 Arquitectura de Despliegue Recomendada

```
Frontend (Vercel): https://youtube-automation.vercel.app
├── React + TypeScript
├── Material-UI
└── Vite

Backend Node.js (Railway): https://youtube-backend.railway.app
├── Express
├── YouTube API
└── Automatización

Backend Python (Render): https://youtube-python.render.com
├── FastAPI
├── Gemini AI
└── Generación de contenido

Database (Supabase/Neon): PostgreSQL
```

## 🚀 Comandos Útiles

```bash
# Probar build localmente
cd frontend/youtube-automation-dashboard
npm run build
npm run preview

# Desplegar solo frontend
vercel --prod

# Ver logs de despliegue
vercel logs

# Eliminar despliegue
vercel rm
```

## 📝 Checklist Antes de Desplegar

- [ ] El frontend funciona localmente
- [ ] `npm run build` funciona sin errores
- [ ] `npm run preview` muestra el sitio correctamente
- [ ] Variables de entorno configuradas
- [ ] .gitignore está configurado correctamente
- [ ] README.md está actualizado
- [ ] No hay hardcoded URLs en el código

## 🎯 Resumen: Qué Seleccionar en Vercel

1. **Framework**: Vite (automático)
2. **Root Directory**: `./frontend/youtube-automation-dashboard`
3. **Build Command**: `npm run build` (automático)
4. **Output Directory**: `dist` (automático)
5. **Install Command**: `npm install` (automático)

Vercel detectará automáticamente la mayoría de estas configuraciones. Solo necesitas verificar el **Root Directory** para que apunte al directorio del frontend.
