# Linkforge

Linkforge is a URL shortener project with an Express.js backend and a React/Vite frontend.

## Project Layout

```text
src/                # Express API
frontend/           # React app
tests/backend/      # Node test files
```

## Setup

```bash
npm install
cd frontend && npm install
```

Copy `.env.example` to `.env` if you want to override `PORT` or `BASE_URL`.

## Run

- `npm run dev` starts the Express API in watch mode.
- `npm start` starts the Express API once.
- `cd frontend && npm run dev` starts the React app with an API proxy to `http://localhost:3000`.
- `cd frontend && npm run build` creates a production frontend bundle.

## Test

- `npm test` runs the backend utility tests.
- `npm run test:watch` reruns them on file changes.
- `cd frontend && npm run build` acts as the frontend verification step.

The current tests cover:

- URL validation via `src/utils/isValidHttpUrl.js`
- short-code generation via `src/utils/generateCode.js`

## Conventions

- Keep backend source files in `src/` and tests in `tests/backend/`.
- Keep frontend UI code in `frontend/src/`.
- Use descriptive filenames, camelCase for functions, and PascalCase for React components.
- Keep environment values in untracked `.env` files and document required keys in `.env.example`.
