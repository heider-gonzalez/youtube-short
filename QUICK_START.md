# 🚀 Guía de Inicio Rápido

## ✅ Estado Actual

- ✅ **Frontend**: Corriendo en http://localhost:3000
- ✅ **GitHub**: Repositorio subido a https://github.com/heider-gonzalez/youtube-short
- ⏳ **Backends**: Pendiente de configuración

## 🎯 Qué Funciona Ahora

### **Frontend Dashboard**
El dashboard está completamente funcional y puedes ver:
- 📊 Dashboard principal con estadísticas
- 🎬 Generador de videos con asistente paso a paso
- 📋 Gestión de canales (interfaz lista)
- 🎯 Gestión de campañas (interfaz lista)
- 📈 Analytics con gráficos interactivos
- 🔥 Análisis de tendencias
- ⚙️ Configuración del sistema

## 🔧 Próximos Pasos para Completar la Instalación

### **1. Instalar Dependencias del Backend Python**
```bash
cd backend-python
pip install -r requirements.txt
```

### **2. Instalar Dependencias del Backend Node.js**
```bash
cd backend-nodejs
npm install
```

### **3. Configurar Variables de Entorno**
```bash
# Copiar el template
cp .env.example .env

# Editar .env con tus credenciales reales:
# - YouTube API keys
# - Gemini API key
# - OpenAI API key
# - ElevenLabs API key
# - Database credentials
```

### **4. Configurar Base de Datos**
```bash
# Instalar PostgreSQL
# Crear base de datos
createdb youtube_automation

# Ejecutar schema
psql youtube_automation < database/schema.sql
```

### **5. Iniciar Redis** (Para colas de tareas)
```bash
redis-server
```

### **6. Iniciar los Servidores**

**Terminal 1 - Backend Python:**
```bash
cd backend-python
python src/main.py
```

**Terminal 2 - Backend Node.js:**
```bash
cd backend-nodejs
npm start
```

**Terminal 3 - Frontend (ya corriendo):**
```bash
cd frontend/youtube-automation-dashboard
npm run dev
```

## 🎬 Cómo Usar el Sistema

### **1. Ver el Dashboard**
Abre http://localhost:3000 en tu navegador

### **2. Probar el Generador de Videos**
- En el Dashboard, haz clic en "Generar video ahora"
- Sigue el asistente de 3 pasos
- (Requiere APIs configuradas para generación real)

### **3. Conectar tu Cuenta de YouTube**
- Ve a la sección "Canales"
- Haz clic en "Conectar Canal"
- Sigue el asistente de autenticación OAuth
- (Requiere credenciales de YouTube API)

## 🌐 Acceso al Proyecto

- **GitHub**: https://github.com/heider-gonzalez/youtube-short
- **Dashboard Local**: http://localhost:3000
- **Backend Python**: http://localhost:8000 (cuando inicie)
- **Backend Node.js**: http://localhost:3001 (cuando inicie)

## 📝 Notas Importantes

### **Lo que funciona ahora:**
- ✅ Interfaz completa del dashboard
- ✅ Navegación entre secciones
- ✅ Componentes interactivos
- ✅ Gráficos y visualizaciones
- ✅ Formularios y diálogos
- ✅ Diseño responsivo

### **Lo que requiere configuración adicional:**
- ⚙️ APIs de IA (Gemini, OpenAI, ElevenLabs)
- ⚙️ YouTube API credentials
- ⚙️ Base de datos PostgreSQL
- ⚙️ Redis para colas
- ⚙️ Variables de entorno

### **Modo Demo vs Producción:**
- **Modo Demo**: El frontend usa datos simulados
- **Modo Producción**: Requiere todas las APIs configuradas

## 🎯 Para Empezar a Monetizar

1. **Configura las APIs** (más importante)
2. **Elige un nicho de alto RPM** (Finanzas, Tecnología)
3. **Crea tu primera campaña automatizada**
4. **Deja que el sistema genere contenido**
5. **Monitorea analytics y optimiza**

## 🆘 Problemas Comunes

### **Frontend no inicia**
```bash
cd frontend/youtube-automation-dashboard
npm install
npm run dev
```

### **Error de dependencias Python**
```bash
cd backend-python
pip install --upgrade pip
pip install -r requirements.txt
```

### **Error de dependencias Node.js**
```bash
cd backend-nodejs
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en `logs/combined.log`
2. Verifica que las variables de entorno estén configuradas
3. Asegúrate de que PostgreSQL y Redis estén corriendo
4. Consulta la guía de autenticación: `AUTHENTICATION_GUIDE.md`

---

**Estado**: Frontend funcional ✅ | Backends pendientes de configuración ⏳
