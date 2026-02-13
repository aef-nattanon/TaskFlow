# TaskFlow

A high-performance, secure, and modern task management application built with React, Node.js, and PostgreSQL.

## 🚀 Features

- **Full Stack Architecture**: React (Vite) frontend + Express/Node.js backend.
- **Database**: PostgreSQL with Prisma ORM.
- **Security First**:
  - **Helmet** for secure HTTP headers (CSP, HSTS).
  - **Rate Limiting** to prevent abuse (Global + Strict Auth limits).
  - **Zod Validation** for all API inputs.
  - **Non-root Docker Container** for enhanced security.
- **High Performance**:
  - **Gzip Compression** for API and static assets.
  - **Nginx Caching** for aggressive static asset caching.
  - **Code Splitting** & **Lazy Loading** for fast initial load.
  - **Debounced Search** & **Memoized Components**.
- **Containerized**: Fully Dockerized with Docker Compose.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS (v3), Vite, Recoil-like Store (Context+Reducer).
- **Backend**: Node.js, Express, Prisma, PostgreSQL.
- **Infrastructure**: Docker, Docker Compose, Nginx.

## 📦 Installation & Running

### Prerequisites

- Docker & Docker Compose
- Node.js v20+ (for local dev without Docker)

### Run with Docker (Recommended)

1.  Clone the repository.
2.  Start the application:
    ```bash
    docker compose up --build -d
    ```
3.  Open [http://localhost:3000](http://localhost:3000).

### Run Locally (Development)

1.  Install dependencies:
    ```bash
    npm install
    cd server && npm install && cd ..
    ```
2.  Set up your `.env` and `server/.env` files (see examples).
3.  Start the development server (Frontend + Backend):
    ```bash
    npm run dev
    ```

## 🔒 Security

- **Authentication**: JWT-based auth with secure password hashing (Bcrypt).
- **Input Validation**: Strict Zod schemas for all endpoints.
- **Least Privilege**: Application runs as a non-root user in Docker.

## ⚡ Performance

- **Tailwind**: Local installation with unused CSS purging (removes ~2MB unused styles).
- **React Optimization**: usage of `React.memo`, `useMemo`, and `React.lazy`.
- **Nginx**: Configured for Gzip compression and long-term caching of hashed assets.

## 📂 Project Structure

- `src/`: React Frontend code
- `server/`: Express Backend code
- `nginx.conf`: Nginx configuration for production
- `docker-compose.yml`: Service orchestration
