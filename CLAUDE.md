# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (port 3000, host 0.0.0.0)
- `npm run build` — production build
- `npm run preview` — preview production build

No test runner, linter, or formatter is configured.

## Architecture

TaskFlow is a client-side-only React 19 + TypeScript SPA for task management, built with Vite.

**Entry flow:** `index.tsx` → `App.tsx` (AppProvider + HashRouter) → route guards → pages

**State management:** Single `useReducer` + React Context in `store.tsx`. Actions: `LOGIN`, `LOGOUT`, `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `TOGGLE_TASK_STATUS`, `ADD_CATEGORY`, `UPDATE_USER`, `TOGGLE_THEME`. Auth and theme persist to `localStorage`.

**Routing:** HashRouter with two guard components — `ProtectedRoute` (redirects unauthenticated to `/signin`) and `PublicRoute` (redirects authenticated to `/dashboard`).

**Authentication is fully mocked** — no backend. SignIn/SignUp simulate a delay then store a user object in localStorage.

**Styling:** Tailwind CSS loaded via CDN `<script>` tag in `index.html` (not PostCSS). Dark mode is class-based. Custom animations and colors are configured inline in the `tailwind.config` block in `index.html`.

**Import maps:** `index.html` contains an importmap pointing to `esm.sh` CDN URLs (for AI Studio browser compatibility). Vite resolves from `node_modules` during local dev.

## Key Files

| File | Purpose |
|------|---------|
| `store.tsx` | Global state (Context + useReducer), localStorage persistence |
| `types.ts` | All TypeScript types (`Task`, `User`, `Category`, `FilterState`) |
| `constants.ts` | Priority colors, ordering, mock seed data |
| `App.tsx` | Router setup, route guards, theme controller |
| `pages/Dashboard.tsx` | Main view: task list, filtering, drag-and-drop, calendar, stats |

## Key Patterns

- **Drag-and-drop** uses `@hello-pangea/dnd`. Manual sort mode calculates order values as midpoints between neighbors.
- **Path alias:** `@` maps to project root (configured in both `vite.config.ts` and `tsconfig.json`).
- **Data model:** Tasks have `priority` (Urgent/High/Medium/Low), `status` (Active/Completed), and numeric `order` for drag sorting.
