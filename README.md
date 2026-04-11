# Games DB (Expo demo)

React Native app built with **Expo SDK 54** and **Expo Router**. It is a **demo only**: there is **no custom backend**. Accounts, sessions, and your game library are stored **on the device** in **SQLite** (including the signed-in user id). Game discovery uses the public **RAWG** HTTP API.

## Features

- **Sign in / Register** — email + password; passwords are **salted SHA-256** hashes in SQLite (appropriate for a demo, not for production threat models).
- **Search** — debounced requests to RAWG with abort for stale responses; **platform** and **genre** modes resolve your text against live **`/platforms`** and **`/genres`** catalogs (cached per session), then filter games.
- **Library** — save games from search results; list and remove locally.
- **Account** — view email and sign out (clears session token only; data remains on device).

**Full technical documentation** (architecture, diagrams, design rationale, code map): see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a **RAWG** API key at [rawg.io/apidocs](https://rawg.io/apidocs) and add a `.env` file in the project root:

   ```bash
   EXPO_PUBLIC_RAWG_API_KEY=your_key_here
   ```

   The app also accepts `EXPO_PUBLIC_API_KEY` for backwards compatibility.

3. Start the dev server:

   ```bash
   npx expo start
   ```

## Project layout

| Path | Role |
|------|------|
| `app/` | Expo Router screens and layouts only |
| `app/(app)/` | Authenticated routes (library, search, account) |
| `src/api/rawg/` | RAWG client, catalog metadata (`/platforms`, `/genres`), errors |
| `src/db/` | SQLite schema + user / library repositories |
| `src/auth/` | Password helpers + `AuthContext` session |
| `src/components/` | Reusable UI |
| `src/theme/` | Colors and spacing tokens |

## Scripts

- `npm start` — Expo dev server  
- `npm run lint` — ESLint (Expo flat config)  
- `npm test` — Jest (add tests under `__tests__/` as needed)  
- `npx tsc --noEmit` — Typecheck  

## Typed routes

`app.json` sets `experiments.typedRoutes` to `false` so CI/typecheck does not depend on a stale `.expo/types/router.d.ts`. After you run `expo start`, you can turn typed routes back on and commit the regenerated definitions if you want strict `href` typing.

## Ideas for the app (still a working demo, ~300h uni-project scope)

The list below stays inside what is realistic for a **graded coursework demo**: no requirement to run a production backend or ship to stores. Pick a small subset that fits your report and time budget.

### What you could add

- **Tests** — Unit tests for `metadata` matching, password helpers, and DB helpers; one or two component tests; optional short note in the report on what you chose to cover.
- **Search UX** — Pagination or “load more” for RAWG results; sorting (e.g. by Metacritic); clearer empty/error states when the API rate-limits.
- **Library UX** — Pull-to-refresh; optional notes or star rating per saved game (new SQLite columns); filters (genre/platform) on the library list.
- **Account** — Change password (re-hash in SQLite); delete account and cascade data; export library as JSON for the report appendix.
- **Accessibility & i18n** — Larger touch targets where needed, `accessibilityLabel`s, German/English strings file (even partial) to show internationalization awareness.
- **Polish** — Consistent loading skeletons; haptics on save; dark mode using existing theme tokens.
- **Report-friendly extras** — Short screen recording, architecture diagram (see [DOCUMENTATION.md](./DOCUMENTATION.md)), reflection on security limits of a client-only demo.

### What you could change or do better in the code

- **Error handling** — Centralize RAWG errors into a small helper so screens don’t duplicate strings; optional retry with backoff for transient failures.
- **State and data fetching** — For a larger demo, a light query layer (e.g. TanStack Query) can simplify cache and loading flags; for a smaller scope, the current hooks are fine if documented.
- **Typing** — Turn `experiments.typedRoutes` back on after a clean `expo start` and commit generated types; tighten a few `unknown`/`any` edges if any remain.
- **Security (still demo-grade)** — Document trade-offs in the report; optional upgrade from SHA-256 to a slower hash only if you have time to justify and test it.
- **Structure** — Split oversized screens into subcomponents when a file grows hard to read; keep `app/` thin and push logic into `src/`.
- **CI** — Add a GitHub Action (or local script) that runs `tsc` + `lint` so the marker sees repeatable quality checks.

None of the above is required for a **working** demo; they are **credible stretch goals** that show judgment within a ~300-hour project frame.

## License

Private project (`package.json`).
