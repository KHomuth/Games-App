# Games DB (Expo demo)

React Native app built with **Expo SDK 54** and **Expo Router**. It is a **demo only**: there is **no custom backend**. Accounts, sessions, and your game library are stored **on the device** (SQLite + AsyncStorage). Game discovery uses the public **RAWG** HTTP API.

## Features

- **Sign in / Register** — email + password; passwords are **salted SHA-256** hashes in SQLite (appropriate for a demo, not for production threat models).
- **Search** — debounced requests to RAWG with abort for stale responses; modes: title, platform keyword, genre keyword.
- **Library** — save games from search results; list and remove locally.
- **Account** — view email and sign out (clears session token only; data remains on device).

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
| `src/api/rawg/` | RAWG client, maps, errors |
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

## License

Private project (`package.json`).
