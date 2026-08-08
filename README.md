# Skill Tracker

Full-stack app for tracking skills, practice sessions, and progress over time.

Instead of scattering notes across tools, you pick a user, manage skills, log practice, and see stats and ranking in one dashboard. The interesting part is the split: a Go REST API and React SPA that run the same way locally with Docker Compose and in production on Vercel, Render, and Neon.

## Features

- Multi-user profiles with client-side active-user selection (`localStorage`)
- Skill CRUD with category, priority, status, and progress (0–100)
- Practice sessions that update skill progress and last-practiced date
- Dashboard with KPIs, Recharts visualizations, and a user ranking
- One-command local stack via Docker Compose
- Cloud-ready deploy: static frontend, containerized API, managed Postgres

## Architecture

```text
Local:   Browser → Nginx (SPA + API proxy) → Go API → PostgreSQL
Cloud:   Browser → Vercel (React) → Render (Go API) → Neon PostgreSQL
```

Backend layout:

```text
HTTP (net/http) → handlers → repositories → PostgreSQL
```

Domain model: `users` → `skills` → `sesiones_practica`. Schema lives in `internal/database/init.sql` (applied automatically by Compose; apply manually on Neon).

There is no HTTP authentication. Identity is the selected user stored in the browser — enough for a portfolio demo, not for private multi-tenant use.

## Technical Highlights

- **Layered Go API.** Handlers own HTTP and validation; repositories own SQL. Models are plain domain structs shared across both.
- **Progress as a write-side effect.** Creating a session inserts into `sesiones_practica` and updates the skill’s `progreso` / `ultima_practica` in the same repository path.
- **Env-driven DB connection.** Prefers `DATABASE_URL` (Neon/Render); falls back to `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` for local Compose. Retries on startup and uses a small connection pool.
- **CORS and port from env.** `CORS_ALLOW_ORIGIN` (default `*`) and `PORT` (default `8080`) so the same binary works locally and on Render.
- **Dockerized API for production.** Multi-stage build produces a static Go binary on Alpine with CA certificates for TLS to managed Postgres. `render.yaml` defines the Web Service blueprint.
- **Local/cloud parity without coupling.** Compose proxies API routes through Nginx; production sets `VITE_API_URL` at build time and talks to Render directly.

## Tech Stack

**Backend**
Go 1.23 · `net/http` · `database/sql` · [lib/pq](https://github.com/lib/pq)

**Frontend**
React 19 · Vite 6 · React Router · Recharts

**Data & infra**
PostgreSQL 16 · Docker / Docker Compose · Nginx (local SPA) · Vercel · Render · Neon

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Run

```bash
docker compose up --build
```

| Service   | URL                     |
| --------- | ----------------------- |
| Frontend  | http://localhost:3000   |
| API       | http://localhost:8080   |
| Postgres  | localhost:5432          |

Health check: `GET http://localhost:8080/health` → `{"status":"ok"}`.

Stop / reset:

```bash
docker compose down        # stop
docker compose down -v     # stop and wipe the DB volume
```

### Without Compose (optional)

1. Run PostgreSQL and apply `internal/database/init.sql`.
2. Copy `.env.example` → `.env` and set the `DB_*` variables (or `DATABASE_URL`).
3. From the repo root: `go run ./cmd/server`
4. Copy `frontend/.env.example` → `frontend/.env`, leave `VITE_API_URL` empty, then:

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/users`, `/skills`, `/ranking`, and `/health` to `localhost:8080`.

### Production sketch

Deploy order: Neon (run `init.sql`) → Render API (`DATABASE_URL`, `CORS_ALLOW_ORIGIN`; do not set `PORT`) → Vercel frontend (root `frontend`, build-time `VITE_API_URL`). Blueprint: `render.yaml`.

## Demo

Live UI: [skill-tracker-kappa.vercel.app](https://skill-tracker-kappa.vercel.app/)

Create or select a user, add a skill, log a practice session, and check the dashboard / ranking. The API may be cold on Render’s free tier — the first request can take a few seconds.

## Case Study

Architecture decisions, trade-offs, and product framing:

[mlavinc-portfolio.vercel.app/projects/skill-tracker](https://mlavinc-portfolio.vercel.app/projects/skill-tracker)
