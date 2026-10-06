# Repository guidance

## Setup and verification

- Run commands from the repository root; this is a single Vite app, not a workspace. The nested `agendei-frontend/` directory is empty.
- Use pnpm 12 (`package.json` → `devEngines`): `pnpm install`, then `pnpm dev`. The lockfile contains separate YAML documents for the package manager and app dependencies; preserve this format.
- Copy `.env.example` to `.env` if missing. The required variable is **`VITE_BACKEND_URL`**, defaulting to `http://localhost:3333` in the example. The README's `VITE_BETTER_AUTH_CLIENT_URL` is stale. `src/env.ts` validates the URL at module load and throws if invalid.
- `pnpm build` runs `tsc -b` before Vite. For typechecking alone, use `pnpm exec tsc -b` (the root tsconfig only references the app and Vite-config projects).
- `pnpm lint` runs only Biome linting. For a focused lint/format/import check, use `pnpm exec biome check src/path/to/file.tsx`; add `--write` to apply fixes. `pnpm format` writes formatting repo-wide.
- Frontend runtime and tests use Node.js only. Run `pnpm test` (or `node --run test`) on Node.js 24+. The suite uses `node:test` and `node:assert/strict`, with no additional test-runner dependency. `tests/register.mjs` handles the `@/` alias and TSX. For a single file: `node --experimental-test-module-mocks --import ./tests/register.mjs --test --experimental-test-isolation=none tests/api.test.ts`.
- The Husky pre-commit hook runs `pnpx lint-staged`; staged JS/TS/JSON/CSS files are rewritten with `pnpm biome check --write --unsafe`.

## Application wiring

- `src/main.tsx` → `src/app.tsx` → `src/routes/Routes.tsx` (`SetupNavigation`). Routing is a client-side `BrowserRouter`; pages opt into `MainLayout` themselves, rather than inheriting a route layout.
- Session handling is in `src/components/Sidebar.tsx`: it calls `auth.useSession()` and redirects unauthenticated users. `MainLayout` renders page children alongside the sidebar, so this is not a route-level guard that blocks child rendering.
- Reuse the Better Auth client exported as `auth` from `src/lib/auth.ts`. It uses `VITE_BACKEND_URL` and declares the additional user field `cnpj`; login and registration already call this client.
- Several business screens are still prototypes: `Schedule.tsx` contains placeholders, and `NewSchedule.tsx` uses local step state. Do not infer backend persistence from the README's feature list.
- `@/*` resolves to `src/*` through `tsconfig.app.json` and Vite's `resolve.tsconfigPaths`. Vite also enables React Compiler through the Babel plugin.

## Formatting

- Follow `biome.json` over inconsistent existing formatting: two spaces, double quotes, semicolons only as needed, no trailing commas, 110-column lines; Biome also organizes imports.

## Source control
- When commiting changes always include Co-authored-by and your AI identification