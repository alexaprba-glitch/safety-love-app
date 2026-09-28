<div align="center">

# Safety Love

### Tu refugio seguro en el mundo digital

![Logo](public/logo.png)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

*Aplicacion web de bienestar emocional disenada para ayudarte a comprender tus emociones, mejorar tus relaciones y construir habitos positivos.*

</div>

---

## Indice

- [Proposito del proyecto](#proposito-del-proyecto)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Arquitectura](#arquitectura)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalacion local paso a paso](#instalacion-local-paso-a-paso)
- [Configuracion de variables de entorno](#configuracion-de-variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Deploy](#deploy)
- [Base de datos](#base-de-datos)

---

## Proposito del proyecto

**Safety Love** es una plataforma de bienestar emocional dirigida a adolescentes y profesionales de la salud mental. Combina herramientas de autoconocimiento con una comunidad de apoyo anonima y asistencia con inteligencia artificial.

**Para usuarios:**
- Diario personal para expresar emociones de forma privada
- Chat con IA que brinda apoyo emocional 24/7
- Blog anonimo para compartir experiencias con la comunidad
- Seguimiento emocional con graficas y calendario
- Mini-juegos de bienestar emocional
- Recordatorios y agenda personal
- Mascotas virtuales interactivas con sistema de niveles

**Para psicologos:**
- Panel dedicado para supervisar el progreso emocional de pacientes
- Gestion centralizada de estudiantes asignados
- Acceso a datos de animo y registros emocionales

**Funcionalidades generales:**
- Modo oscuro / claro con temas personalizables
- Ajuste de tamano de texto
- Bloqueo con PIN para proteger la cuenta
- 7 mascotas virtuales con personalidades distintas
- Soporte bilingue (Espanol / Ingles)
- Diseno responsive (escritorio, tablet, movil)

---

## Capturas de pantalla

> Agrega capturas reales de la app en la carpeta `screenshots/` y referencialas aqui.

| Landing Page | Login | Dashboard |
|:---:|:---:|:---:|
| ![Landing](screenshots/landing.png) | ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

| Blog Anonimo | Chat IA | Calendario Emocional |
|:---:|:---:|:---:|
| ![Blog](screenshots/blog.png) | ![Chat](screenshots/chat.png) | ![Calendario](screenshots/calendario.png) |

| Mini-Juegos | Configuracion | Panel Psicologo |
|:---:|:---:|:---:|
| ![Juegos](screenshots/juegos.png) | ![Config](screenshots/config.png) | ![Psicologo](screenshots/psicologo.png) |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (React + Vite)                   │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Landing  │  │  Login   │  │Dashboard │  │   Psicologo    │  │
│  │  Page    │  │  Page    │  │ Escritorio│  │   Dashboard    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
│       │              │              │                │            │
│  ┌────▼──────────────▼──────────────▼────────────────▼────────┐  │
│  │                    SERVICIOS (services/)                   │  │
│  │  auth.js  │  posts.js  │  moods.js  │  chat.js  │  psych  │  │
│  └────────────────────────────┬───────────────────────────────┘  │
│                               │                                  │
│  ┌────────────────────────────▼───────────────────────────────┐  │
│  │                  COMPONENTES REUTILIZABLES                 │  │
│  │  BottomBar │ CategorySidebar │ Avatar3D │ SafetyMascot    │  │
│  │  Toast     │ LoadingSpinner  │ EmotionDayModal │ ...     │  │
│  └────────────────────────────┬───────────────────────────────┘  │
│                               │                                  │
│  ┌────────────────────────────▼───────────────────────────────┐  │
│  │                    SECCIONES PRINCIPALES                   │  │
│  │  BlogAnonimo │ ChatIA │ DiaryPersonal │ GamesSection      │  │
│  │  AgendaSection │ RemindersSection │ SeguimientoEmocional  │  │
│  │  QuizEmocional │ MemoriaSentimientos │ GreenRedFlagGame   │  │
│  │  AnonymousChatSection │ PsicologoSection │ ...            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS (Supabase Client SDK)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVIDOR (Supabase)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Auth        │  │  PostgreSQL  │  │  Row Level Security  │  │
│  │  (JWT)       │  │  Database    │  │  (RLS Policies)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  Tablas: profiles, posts, comments, mood_entries,              │
│          student_psychologist, chat_sessions, chat_messages,    │
│          saved_messages, saved_verses, letters                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API EXTERNA (Groq AI)                      │
│              Chat con inteligencia artificial                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de datos

1. **Autenticacion:** El usuario se registra o inicia sesion via Supabase Auth. Se crea un perfil automaticamente con un trigger en la base de datos.
2. **Blog anonimo:** Las publicaciones se almacenan en PostgreSQL con identidad encriptada. Cualquier usuario autenticado puede leer, comentar y reaccionar.
3. **Chat IA:** Los mensajes se envian a la API de Groq y se almacenan en `chat_messages` para mantener historial.
4. **Seguimiento emocional:** Las entradas del calendario se guardan en `mood_entries` con un constraint `UNIQUE(user_id, date)`.
5. **Relacion estudiante-psicologo:** Se establece durante el registro y permite al psicologo ver datos de sus pacientes asignados.

---

## Tecnologias utilizadas

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| React | 18.2 | Framework de interfaz de usuario |
| Vite | 8.2 | Bundler y servidor de desarrollo |
| Tailwind CSS | 4.3 | Estilos utility-first |
| Supabase | 2.106 | Backend como servicio (DB, Auth, RLS) |
| Framer Motion | 12.4 | Animaciones y transiciones |
| Lucide React | 1.14 | Iconografia SVG |
| Three.js / React Three Fiber | 0.185 / 8.18 | Renderizado 3D para mascotas |
| Twemoji | 14.0 | Emojis consistentes cross-platform |
| Groq API | - | Backend de IA para chat emocional |

---

## Estructura del proyecto

```
safety-love/
├── public/                    # Archivos estaticos (logo.png)
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── landing/           #   Header, Hero, Features, FAQ, etc.
│   │   ├── BottomBar.jsx
│   │   ├── CategorySidebar.jsx
│   │   ├── Avatar3D.jsx
│   │   ├── SafetyMascot.jsx
│   │   ├── MascotSelector.jsx
│   │   ├── AppearancePanel.jsx
│   │   ├── AnimatedChicken.jsx
│   │   └── AvatarPreview.jsx
│   │
│   ├── services/              # Capa de acceso a datos
│   │   ├── auth.js            #   Registro, login, sesion
│   │   ├── posts.js           #   CRUD de publicaciones
│   │   ├── moods.js           #   Estados de animo
│   │   ├── chat.js            #   Mensajes con IA
│   │   ├── psychologist.js    #   Relacion estudiante-psicologo
│   │   └── index.js           #   Re-exportaciones
│   │
│   ├── public/                # Assets internos
│   │   ├── assets/            #   bg.png, cat.png, dog.png, bird.png
│   │   └── mascot/            #   checkin.png
│   │
│   ├── main.jsx               # Punto de entrada (ReactDOM.createRoot)
│   ├── App.jsx                # Componente principal (estado global)
│   ├── LandingPage.jsx        # Pagina de aterrizaje
│   ├── LoginPage.jsx          # Login y registro
│   ├── DashboardEscritorio.jsx # Dashboard principal del usuario
│   ├── PsychologistDashboard.jsx # Panel del psicologo
│   ├── LogoutScreen.jsx       # Animacion de cierre de sesion
│   ├── SplashScreen.jsx       # Pantalla de carga inicial
│   ├── supabase.js            # Configuracion del cliente Supabase
│   │
│   ├── ChatIA.jsx             # Chat con inteligencia artificial
│   ├── BlogAnonimo.jsx        # Blog anonimo comunitario
│   ├── DiaryPersonalSection.jsx # Diario personal
│   ├── AgendaSection.jsx      # Agenda y calendario
│   ├── RemindersSection.jsx   # Sistema de recordatorios
│   ├── GamesSection.jsx       # Mini-juegos de bienestar
│   ├── SeguimientoEmocionalSection.jsx # Graficas emocionales
│   ├── EstudiantesSection.jsx # Gestion de estudiantes (psicologo)
│   ├── PsicologoSection.jsx   # Chat con psicologo
│   ├── ConfiguracionStudentSection.jsx # Configuracion usuario
│   ├── ConfiguracionSection.jsx # Configuracion psicologo
│   │
│   ├── QuizEmocional.jsx      # Quiz emocional
│   ├── MemoriaSentimientos.jsx # Juego de memoria
│   ├── GreenRedFlagGame.jsx   # Juego de senales verde/roja
│   │
│   ├── Toast.jsx              # Sistema de notificaciones toast
│   ├── SafetyMascot.jsx       # Componente de mascotas 3D
│   ├── mascotData.js          # Datos y configuracion de mascotas
│   ├── emergencyStore.js      # Store de emergencia
│   │
│   └── index.css              # Estilos globales y variables CSS
│
├── dist/                      # Build de produccion
├── nodejs/                    # Binarios de Node.js locales
│
├── index.html                 # HTML de entrada
├── package.json               # Dependencias y scripts
├── package-lock.json          # Lockfile de dependencias
├── vite.config.js             # Configuracion de Vite
├── tailwind.config.js         # Configuracion de Tailwind CSS
├── postcss.config.js          # Configuracion de PostCSS
├── supabase-schema.sql        # Esquema completo de la BD
├── .env.example               # Plantilla de variables de entorno
├── .env                       # Variables de entorno (no commitear)
├── .gitignore                 # Archivos ignorados por Git
├── app.js                     # Script auxiliar
├── replace.cjs                # Script de reemplazo
└── restore.cjs                # Script de restauracion
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior (v20+ recomendado)
- npm v9 o superior
- Una cuenta en [Supabase](https://supabase.com/) (para backend)
- Una API key de [Groq](https://groq.com/) (para el chat con IA)

---

## Instalacion local paso a paso

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/safety-love.git
cd safety-love
```

### Paso 2: Instalar dependencias

```bash
npm install
```

> Si el `npm install` global no funciona, puedes usar el binario incluido en el proyecto:
> ```bash
> ./nodejs/npm install
> ```

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raiz del proyecto con el siguiente contenido:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_GROQ_API_KEY=tu_api_key_de_groq
```

Puedes copiar el ejemplo incluido:

```bash
cp .env.example .env
```

Luego edita `.env` con tus credenciales reales.

### Paso 4: Configurar la base de datos

1. Crea un nuevo proyecto en [Supabase](https://supabase.com/)
2. Ve al **SQL Editor** del dashboard
3. Abre el archivo `supabase-schema.sql` de este repositorio
4. Copia y pega todo el contenido en el SQL Editor
5. Haz clic en **Run** para crear todas las tablas, triggers e indices

### Paso 5: Iniciar el servidor de desarrollo

```bash
npm run dev
```

### Paso 6: Abrir en el navegador

Visita la URL que aparece en la terminal, normalmente:

```
http://localhost:5173
```

Listo. La app estara funcionando localmente.

---

## Configuracion de variables de entorno

| Variable | Descripcion | Obligatoria |
|----------|-------------|:-----------:|
| `VITE_SUPABASE_URL` | URL de tu proyecto en Supabase | Si |
| `VITE_SUPABASE_ANON_KEY` | Clave anonima (public) de Supabase | Si |
| `VITE_GROQ_API_KEY` | API key de Groq para el chat con IA | Si |

> **Nota:** Las variables que comienzan con `VITE_` estan expuestas al cliente. Nunca guardes secrets sensibles aqui.

---

## Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera la build de produccion en `dist/` |
| `npm run preview` | Previsualiza la build de produccion localmente |
| `npm run lint` | Ejecuta ESLint para detectar errores de estilo |

---

## Deploy

### Vercel (recomendado)

```bash
npm i -g vercel
vercel
```

### Netlify

1. Conecta tu repositorio de GitHub
2. Build command: `npm run build`
3. Directorio de salida: `dist`

### Cualquier hosting estatico

```bash
npm run build
# Sube la carpeta dist/ a tu hosting
```

---

## Base de datos

El esquema completo se encuentra en `supabase-schema.sql`. Tablas principales:

| Tabla | Descripcion |
|-------|-------------|
| `profiles` | Perfiles de usuario (nombre, rol, avatar, mascota) |
| `posts` | Publicaciones del blog anonimo |
| `comments` | Comentarios en publicaciones |
| `mood_entries` | Registros del calendario emocional |
| `student_psychologist` | Relacion estudiante-psicologo |
| `chat_sessions` | Sesiones de chat con IA |
| `chat_messages` | Mensajes del chat con IA |
| `saved_messages` | Mensajes motivacionales guardados |
| `saved_verses` | Versiculos de consuelo guardados |
| `letters` | Cartas anonimas |

Todas las tablas tienen **Row Level Security (RLS)** habilitado con politicas que garantizan que cada usuario solo pueda acceder a sus propios datos (excepto el blog, que es publico para lectura).

---

<div align="center">

**Safety Love** -- Cuidar tu salud emocional es un acto de amor propio.

</div>
