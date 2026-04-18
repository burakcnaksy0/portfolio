# Portfolio CMS Platform

A full-stack personal portfolio & content management system built with **Java 21 + Spring Boot 3** on the backend and **React 18 + TypeScript** on the frontend.

## 🚀 Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Backend   | Java 17+, Spring Boot 3.3, Spring Security 6 (JWT), Spring Data JPA, Flyway |
| Database  | PostgreSQL 16 |
| Frontend  | React 18, TypeScript, Vite, TanStack Query v5, Zustand, Tailwind CSS v3 |
| UI/UX     | Framer Motion, Lucide React, React Hot Toast, Recharts |
| Forms     | React Hook Form + Zod |
| Auth      | JWT (access token in memory, refresh token in HttpOnly cookie) |
| Upload    | Cloudinary (via backend) |
| Deploy    | Docker + Docker Compose |

## 📁 Project Structure

```
portfolio/
├── portfolio-backend/      # Spring Boot REST API
├── portfolio-frontend/     # React + TypeScript SPA
├── docker-compose.yml
└── .env.example
```

## 🛠️ Local Development Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node 20+
- PostgreSQL 16 (or use Docker)

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env with your values
```

### 2. Start with Docker Compose

```bash
docker compose up -d
```

This starts:
- PostgreSQL on `:5432`
- Spring Boot API on `:8080`
- React frontend on `:80`

### 3. Manual Development

**Backend:**
```bash
cd portfolio-backend
mvn spring-boot:run
# API: http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html
```

**Frontend:**
```bash
cd portfolio-frontend
npm install
npm run dev
# http://localhost:5173
```

## 🔐 Default Admin Credentials

```
Email:    admin@portfolio.com
Password: Admin1234!
```

> Change these via environment variables in production!

## 📡 API Endpoints

| Method   | Endpoint                    | Auth    | Description |
|----------|-----------------------------|---------|-------------|
| POST     | /api/auth/login             | Public  | Login |
| POST     | /api/auth/refresh           | Cookie  | Refresh token |
| POST     | /api/auth/logout            | Any     | Logout |
| GET      | /api/projects               | Public  | Get projects |
| GET      | /api/blog                   | Public  | Get published posts |
| GET      | /api/experiences            | Public  | Get experiences |
| GET      | /api/certificates           | Public  | Get certificates |
| POST     | /api/messages               | Public  | Send contact message |
| GET      | /api/dashboard/stats        | Admin   | Dashboard statistics |
| POST     | /api/upload/image           | Admin   | Upload image |

Full API documentation: `http://localhost:8080/swagger-ui.html`

## 🌐 Pages

### Public
- `/` — Home (hero + featured projects + latest blog)
- `/projects` — Projects with tag filter
- `/blog` — Blog with search + tag filter
- `/experience` — Work experience timeline
- `/certificates` — Certificates grid
- `/contact` — Contact form

### Admin (`/admin/*`)
- `/admin/login` — Login
- `/admin` — Dashboard with stats
- `/admin/projects` — CRUD projects
- `/admin/blog` — CRUD blog posts (Markdown)
- `/admin/experience` — CRUD work experience
- `/admin/certificates` — CRUD certificates
- `/admin/messages` — Read/delete messages

## 🐳 Docker

```bash
# Build and start all services
docker compose up --build

# Stop
docker compose down

# Logs
docker compose logs -f backend
```

## 📝 Environment Variables

See `.env.example` for all required variables.

| Variable               | Description |
|------------------------|-------------|
| DB_PASSWORD            | PostgreSQL password |
| JWT_SECRET             | 256-bit secret for JWT signing |
| CLOUDINARY_CLOUD_NAME  | Cloudinary cloud name |
| CLOUDINARY_API_KEY     | Cloudinary API key |
| CLOUDINARY_API_SECRET  | Cloudinary API secret |
| CORS_ALLOWED_ORIGINS   | Frontend URL(s) for CORS |
| ADMIN_EMAIL            | Initial admin email |
| ADMIN_PASSWORD         | Initial admin password |
