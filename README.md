# Safety Love

**Tu refugio seguro en el mundo digital.**

Safety Love es una aplicación web de bienestar emocional diseñada para ayudarte a comprender tus emociones, mejorar tus relaciones y construir hábitos positivos. Expresa lo que sientes, recibe apoyo con IA, organiza tu vida y conéctate con una comunidad que te entiende.

---

## Características principales

### Para usuarios
- **Diario personal** — Escribe y desahógate de forma privada sobre cómo te sientes cada día.
- **Chat con IA** — Recibe apoyo emocional, reflexiones y consejos personalizados las 24 horas.
- **Blog anónimo** — Comparte sentimientos y experiencias con la comunidad sin revelar tu identidad.
- **Relaciones** — Aprende a comunicarte mejor, pon límites y construye vínculos más sanos.
- **Seguimiento emocional** — Visualiza patrones de tus emociones a lo largo del tiempo.
- **Mini-juegos** — Diviértete mientras aprendes sobre bienestar emocional.
- **Recordatorios** — Configura recordatorios para cuidarte y mantener hábitos saludables.
- **Agenda** — Organiza tus actividades y eventos personales.
- **Mascotas virtuales** — Elige un compañero virtual que te acompañe en tu camino.

### Para psicólogos
- **Panel de estudiantes** — Supervisa el progreso emocional de tus pacientes.
- **Gestión de pacientes** — Administra tus sesiones y comunicaciones de forma centralizada.
- **Dashboard dedicado** — Interfaz especializada con herramientas para profesionales de la salud mental.

### Funcionalidades generales
- **Modo oscuro / claro** — Tema personalizable para tu comodidad visual.
- **Tamaño de texto** — Ajusta el tamaño de fuente según tus necesidades.
- **Bloqueo con PIN** — Protege tu cuenta con un código de seguridad.
- **Selección de mascota** — 7 mascotas únicas con personalidades distintas.
- **Diseño responsive** — Funciona en escritorio, tablet y móvil.

---

## Tecnologías utilizadas

| Tecnología | Propósito |
|------------|-----------|
| React 18 | Framework de UI |
| Vite 8 | Bundler y servidor de desarrollo |
| Tailwind CSS 4 | Estilos utility-first |
| Supabase | Backend como servicio (base de datos, auth, storage) |
| Framer Motion | Animaciones y transiciones |
| Lucide React | Iconografía |
| Three.js / React Three Fiber | Renderizado 3D para mascotas |
| Twemoji | Emojis consistentes cross-platform |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior
- Cuenta de [Supabase](https://supabase.com/) (para backend)

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/safety-love.git

# Entrar al directorio
cd safety-love

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crea un archivo .env en la raíz con:
# VITE_SUPABASE_URL=tu_url_de_supabase
# VITE_SUPABASE_ANON_KEY=tu_clave_anon

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:5173`

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta el linter (ESLint) |

---

## Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
├── services/            # Servicios y utilidades
├── public/              # Archivos estáticos (logo, imágenes)
│
├── main.jsx             # Punto de entrada de la aplicación
├── App.jsx              # Enrutador principal
├── supabase.js          # Configuración de Supabase
│
├── LandingPage.jsx      # Página de aterrizaje
├── LoginPage.jsx        # Login y registro de usuarios
├── DashboardEscritorio.jsx  # Dashboard principal del usuario
├── PsychologistDashboard.jsx # Panel del psicólogo
│
├── ChatIA.jsx           # Chat con inteligencia artificial
├── BlogAnonimo.jsx      # Blog anónimo comunitario
├── DiaryPersonalSection.jsx  # Diario personal
├── AgendaSection.jsx    # Agenda y calendario
├── RemindersSection.jsx # Sistema de recordatorios
├── GamesSection.jsx     # Mini-juegos de bienestar
├── SeguimientoEmocionalSection.jsx # Gráficas emocionales
├── EstudiantesSection.jsx  # Gestión de estudiantes (psicólogo)
├── PsicologoSection.jsx    # Chat con psicólogo
├── ConfiguracionStudentSection.jsx # Configuración del usuario
├── ConfiguracionSection.jsx # Configuración del psicólogo
│
├── SafetyMascot.jsx     # Componente de mascotas 3D
├── MascotSelector.jsx   # Selector de mascota
├── mascotData.js        # Datos y configuración de mascotas
│
├── QuizEmocional.jsx    # Quiz emocional
├── MemoriaSentimientos.jsx # Juego de memoria
├── GreenRedFlagGame.jsx # Juego de señales verde/roja
│
└── index.css            # Estilos globales y variables CSS
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

---

## Deploy

### Vercel (recomendado)

```bash
npm i -g vercel
vercel
```

### Netlify

1. Conecta tu repositorio de GitHub
2. Configura el build command: `npm run build`
3. Configura el directorio de salida: `dist`

### Cualquier hosting estático

```bash
npm run build
# Sube la carpeta dist/ a tu hosting
```

---

## Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## Contacto

Si tienes preguntas o sugerencias, contacta al equipo de desarrollo de Safety Love.
