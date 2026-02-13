# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start both Frontend (Vite) and Backend (Express) in dev mode
- `npm run client` — start only Frontend
- `npm run server` — start only Backend (port 3001)
- `npm run build` — build frontend for production
- `docker compose up --build` — build and start full stack in Docker

## Architecture

TaskFlow is a **full-stack** application:

1.  **Frontend**: React 19 + TypeScript + Vite.
    *   **Styling**: Tailwind CSS (local, v3), Dark mode class-based.
    *   **State**: Global Context `store.tsx`.
    *   **Routing**: `react-router-dom` with Lazy Loading.
    *   **API**: Axois/Fetch wrapper in `lib/api.ts`.

2.  **Backend**: Node.js + Express.
    *   **Database**: PostgreSQL via Prisma ORM.
    *   **Validation**: Zod via `middleware/validate.ts`.
    *   **Security**: Helmet, Rate Limit, CORS.
    *   **Auth**: JWT (Bearer token).

3.  **Infrastructure**:
    *   **Docker**: Multi-stage builds for client (Nginx) and server (Node).
    *   **Nginx**: Serves static assets + Reverse proxies `/api/*` to backend.

## Key Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates Client, Server, and PostgreSQL |
| `server/prisma/schema.prisma` | Database Schema (User, Task, Category) |
| `server/src/app.ts` | Express entry point, middleware setup |
| `server/src/middleware/validate.ts` | Zod validation middleware |
| `server/src/schemas/*.ts` | Zod validation schemas |
| `nginx.conf` | Production web server config |
| `tailwind.config.js` | Tailwind CSS configuration |
| `store.tsx` | Frontend State Management |

## Development Patterns

- **Validation**: ALWAYS create/update Zod schemas in `server/src/schemas/` when changing API inputs.
- **Styling**: Use Tailwind utility classes. Avoid inline styles.
- **Performance**: Use `React.memo` for list items. Debounce heavy user inputs.
- **Docker**: If adding dependencies, remember to rebuild images (`docker compose up --build`).
- **Security**:
    - Secrets handling: Use env vars (never commit secrets).
    - Validation: Validate ALL inputs on the backend.
    - Rate Limiting: Strict limits on Auth endpoints.
