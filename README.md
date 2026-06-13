# Skill Tracker

Full-stack application for tracking skills, practice sessions, and progress.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Nginx |
| Backend | Go (Golang) |
| Database | PostgreSQL |
| Containerization | Docker + Docker Compose |

---

## 📦 Project Structure
skill-tracker/

├── backend/

│   └── Dockerfile

├── frontend/

│   └── Dockerfile

├── database/

│   └── init.sql

├── docker-compose.yml

└── README.md

---

## 🧪 Run Locally

Make sure you have Docker installed, then run:

```bash
docker compose up --build
```

---

## 🌐 Access the App

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Database | localhost:5432 |

---

## 🧱 Database Schema

### `users`
| Column | |
|---|---|
| `id` | |
| `nombre` | |
| `color` | |
| `creado_en` | |

### `skills`
| Column | |
|---|---|
| `id` | |
| `nombre` | |
| `categoria` | |
| `prioridad` | |
| `estado` | |
| `notas` | |
| `ultima_practica` | |
| `progreso` | |
| `user_id` | |

### `sesiones_practica`
| Column | |
|---|---|
| `id` | |
| `skill_id` | |
| `fecha` | |
| `duracion_minutos` | |
| `notas` | |
| `progreso_percibido` | |

---

## 🐳 Docker

This project runs fully with Docker Compose:

- PostgreSQL runs in a container with persistent volume
- Backend connects via internal Docker network
- Frontend is served via Nginx after Vite build

**Stop containers:**
```bash
docker compose down
```

**Reset database:**
```bash
docker compose down -v
```

---

## ☁️ Cloud Ready

This project is fully containerized and ready for deployment on:

- Render
- AWS (ECS / EC2)
- Railway
- Fly.io

In production:
- DB should be replaced with managed PostgreSQL (e.g. RDS / Render DB)
- Backend and frontend use environment variables for configuration

---

## 🧠 Notes

- Uses persistent Docker volume for PostgreSQL data
- Frontend uses Nginx to serve static build
- Backend is stateless and environment-configured
- Designed for easy migration to cloud environments

---

## 📌 Author
Martin Lavin Carvajal
Skill Tracker — Full-stack learning project with Go + React + Docker