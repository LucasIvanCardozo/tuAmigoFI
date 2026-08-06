<div align="center">

# TuAmigoFI

Plataforma colaborativa para estudiantes de la **Facultad de Ingeniería de Mar del Plata** (UNMDP).

[Finales](#-acerca-del-proyecto) · [Trabajos prácticos](#-acerca-del-proyecto) · [Calendario académico](#-funcionalidades) · [Comunidad](#-contribuir)

Construido con Next.js 16, TypeScript, Prisma y PostgreSQL.

</div>

---

## 📖 Acerca del proyecto

**TuAmigoFI** es un espacio donde los estudiantes pueden compartir material académico —trabajos prácticos, parciales, finales, respuestas y resoluciones— y construir una comunidad de aprendizaje entre pares. Los aportes se pueden comentar, evaluar y discutir, generando un ciclo de retroalimentación que enriquece el estudio colectivo.

El objetivo principal es facilitar el acceso a recursos de estudio y promover la colaboración como motor de aprendizaje dentro de la facultad.

> Proyecto personal y open source, mantenido por y para la comunidad de la FI Mar del Plata.

---

## ✨ Funcionalidades

- 🔐 **Autenticación con Google** mediante NextAuth.js, con sesión persistente y soporte para refresh token.
- 🧑‍🎓 **Catálogo académico**: carreras, planes de estudio, materias, años y correlatividades.
- 📚 **Repositorio de TPs y parciales**: cada materia reúne sus prácticos y exámenes con sus respectivas respuestas.
- 💬 **Respuestas multimodales**: texto, imagen, código con resaltado de sintaxis (`highlight.js`) y archivos PDF embebidos (`react-pdf`).
- 💡 **Comentarios y reacciones** sobre cada respuesta, con puntaje ponderado por autor.
- 🏆 **Ranking de contribuidores** con score dinámico según aportes (`links + midterms·5 + tps·6 + reactions + responses·3 + comments`).
- 🛡️ **Moderación**: sistema de reportes y baneo de usuarios.
- 📅 **Calendario académico** anual con recesos, feriados, totalizadores e inicio/fin de cuatrimestre.
- 🔗 **Links útiles** por materia, marcados como oficiales o comunitarios.
- ☁️ **Subida de archivos** a Cloudinary con endpoints dedicados.
- 📱 **Diseño responsive** y accesible, con modo oscuro, animaciones suaves y skeletons de carga.

---

## 🛠️ Stack tecnológico

| Capa            | Tecnología                                                        |
| --------------- | ----------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org/) (App Router, Cache Components) |
| Lenguaje        | [TypeScript 5.9](https://www.typescriptlang.org/) (strict)       |
| Estilos         | [Tailwind CSS 4](https://tailwindcss.com/)                       |
| ORM             | [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg`         |
| Base de datos   | [PostgreSQL](https://www.postgresql.org/)                         |
| Auth            | [NextAuth.js 4](https://next-auth.js.org/) (Google Provider)      |
| Almacenamiento  | [Cloudinary](https://cloudinary.com/) + `next-cloudinary`         |
| UI              | `react-icons`, `react-modal`, `sileo` (toasts), `react-multi-date-picker` |
| Markdown / PDF  | `react-highlight`, `react-pdf`                                    |
| Validación      | [Zod 4](https://zod.dev/)                                         |
| Package manager | [pnpm](https://pnpm.io/)                                          |

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas con separación clara de responsabilidades:

```
Cliente (Server Components + Client Components)
           │
           ▼
Server Actions  ◀────  Route Handlers  (/api/*)
           │                  │
           ▼                  ▼
      Casos de uso (lib/server/usecases)
           │
           ▼
     Repositorios (lib/server/db/repository)
           │
           ▼
   Prisma Client  ◀────  PostgreSQL
```

Decisiones técnicas relevantes:

- **App Router + RSC**: las páginas y listados son Server Components; los formularios, modales y menús interactivos son Client Components.
- **Cache Components** (Next.js 16): uso de `'use cache: remote'` con `cacheLife` y `cacheTag` para cachear consultas frecuentes por TTL e invalidar por tags.
- **Patrón Repository + Use Cases**: la capa de datos está aislada en `lib/server/repository` y la lógica de negocio en `lib/server/usecases`, lo que facilita el testing y la sustitución de la fuente de datos.
- **Server Actions** para mutaciones (crear/editar/borrar TPs, parciales, respuestas, comentarios, reacciones, links y usuarios).
- **Route Handlers** específicos para `upload`, `destroy` y `destroyAll` (integración con Cloudinary).

---

## 📂 Estructura del proyecto

```
src/app/
├── (pages)/                     # Rutas con route group
│   ├── materias/                # Catálogo y detalle de materias
│   │   ├── parciales/[id]/      # Parciales por materia
│   │   └── practica/[id]/       # Trabajos prácticos por materia
│   ├── contactame/              # Página de contacto
│   └── politica-de-privacidad/  # Política de privacidad
├── api/                         # Route Handlers
│   ├── auth/[...nextauth]/      # NextAuth
│   ├── upload/                  # Subida a Cloudinary
│   ├── destroy/                 # Borrado de un asset
│   └── destroyAll/              # Borrado masivo
├── components/
│   ├── feature/materias/        # Componentes del dominio "materias"
│   ├── form/                    # Inputs y formularios
│   ├── layout/                  # Nav, footer, providers, modals
│   ├── modals/                  # Modales (alta/baja de entidades)
│   └── skeletons/               # Estados de carga
├── contexts/                    # React Context providers
├── hooks/                       # Hooks personalizados
├── lib/server/
│   ├── actions/                 # Server Actions (mutaciones)
│   ├── auth/                    # Configuración de NextAuth
│   ├── db/
│   │   ├── prisma/              # Schema, cliente generado y seeds
│   │   └── repository/          # Repositorios por entidad
│   └── usecases/                # Casos de uso (capa de negocio)
├── types/                       # Tipos compartidos
└── utils/                       # Utilidades (capitalize, makeModules, etc.)
```

---

## 🚀 Empezando

### Requisitos previos

- **Node.js 20+**
- **pnpm** (`npm i -g pnpm`)
- **PostgreSQL 14+** corriendo en local o un servicio gestionado

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/tuAmigoFI.git
cd tuAmigoFI

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno (ver siguiente sección)
cp .env.example .env

# 4. Generar el cliente de Prisma y aplicar migraciones
pnpm exec prisma generate
pnpm exec prisma migrate deploy

# 5. (Opcional) Cargar datos de ejemplo
pnpm exec prisma db seed

# 6. Iniciar el servidor de desarrollo
pnpm dev
```

La aplicación quedará disponible en [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Crear un archivo `.env` en la raíz con las siguientes claves:

```bash
# --- Base de datos ---
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tuamigofi"

# --- NextAuth ---
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secreto-con-openssl-rand-base64-32"

# --- Google OAuth (NextAuth provider) ---
GOOGLE_CLIENT_ID="xxxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxxxxxxxxxxxxxx"

# --- Cloudinary ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="xxxxxxxxxxxx"
CLOUDINARY_API_SECRET="xxxxxxxxxxxx"
```

> ℹ️ Nunca commitees el archivo `.env`. Ya está incluido en `.gitignore`.

### Base de datos

El esquema Prisma vive en `src/app/lib/server/db/prisma/schema.prisma`. Comandos útiles:

```bash
pnpm exec prisma studio          # Inspeccionar la base en el navegador
pnpm exec prisma migrate dev     # Crear/actualizar migraciones en desarrollo
pnpm exec prisma db seed         # Ejecutar seeds (carreras, materias, años, planes, correlativas)
```

---

## 📜 Scripts disponibles

| Comando         | Descripción                                  |
| --------------- | -------------------------------------------- |
| `pnpm dev`      | Servidor de desarrollo con hot-reload        |
| `pnpm build`    | Build de producción                          |
| `pnpm start`    | Inicia el servidor con el build de producción |
| `pnpm lint`     | Corre ESLint sobre el proyecto               |

> No hay framework de testing configurado en el proyecto, por lo que no se incluyen comandos de test.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para mantener la calidad del proyecto:

1. Hacé un fork y creá una rama descriptiva (`git checkout -b feat/nueva-funcionalidad`).
2. Mantené el estilo existente: sin comentarios redundantes, código autoexplicativo, TypeScript estricto.
3. Usá las **path aliases** (`@/`) y respetá las convenciones de naming:
   - `kebab-case` para archivos y carpetas
   - `PascalCase` para componentes y tipos
   - `camelCase` para funciones y constantes
4. Asegurate de que `pnpm lint` pase sin warnings antes de abrir el PR.
5. Describí claramente el cambio y, si aplica, adjuntá capturas o un video corto.

Las ideas, sugerencias y reportes de bugs podés enviarlos por [contacto directo](#-contacto) o abriendo un *issue*.

---

## 🗺️ Roadmap

- [ ] Notificaciones en tiempo real ante nuevas respuestas o comentarios
- [ ] Búsqueda full-text sobre respuestas
- [ ] Modo claro/oscuro con persistencia
- [ ] PWA y soporte offline
- [ ] API pública documentada para integraciones externas

---

## 📄 Licencia

Distribuido bajo la licencia **Apache 2.0**. Consultá el archivo [LICENSE](./LICENSE) para más detalles.

---

## ✉️ Contacto

**Lucas Iván Cardozo** — creador y mantenedor

- 📧 Email: [lucasivancardozo27@gmail.com](mailto:lucasivancardozo27@gmail.com)
- 📱 WhatsApp: [+54 223 531 9564](https://wa.me/2235319564)
- 📷 Instagram: [@lucardozo27](https://www.instagram.com/lucardozo27/)

---

## 🙏 Agradecimientos

- A la **Facultad de Ingeniería de la UNMDP** y al **Centro de Estudiantes (Cauces)** por mantener los canales oficiales que se referencian desde la app.
- A cada estudiante que aporta material, corrige errores y ayuda a que esta plataforma crezca.
- A la comunidad open source, cuyas herramientas hacen posible este proyecto.

---

<div align="center">

Hecho con ☕ y muchas horas de cursada en la facu.

</div>