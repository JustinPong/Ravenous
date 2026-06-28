# Ravenous

A client-side React app that searches local businesses with the Yelp Fusion API — search by term, filter by location, and sort by best match, highest rated, or most reviewed.

**🔗 Live demo:** https://justinpong.github.io/Ravenous

## Features

- Search businesses by term + location
- Sort by **Best Match**, **Highest Rated**, or **Most Reviewed**
- Each result shows photo, name, address, category, rating, and review count
- Blank location falls back to a default city (New York, NY) instead of erroring

## Tech stack

- **React 15** (Create React App, `react-scripts` 3)
- **Yelp Fusion API** v3
- **Cloudflare Worker** — production API proxy
- **GitHub Pages** — hosting

## How the Yelp API is called

Yelp's API sends no CORS headers and requires a secret key, so the browser can't call it directly. A proxy injects the `Authorization` header server-side, so the key never ships in the browser bundle:

- **Development** — `src/setupProxy.js` (CRA dev proxy) forwards `/api/yelp/*` to Yelp, reading the key from `.env`.
- **Production** — a Cloudflare Worker (`worker/yelp-proxy.js`) does the same and adds CORS. The frontend calls it via the `REACT_APP_YELP_PROXY` URL.

## Local development

Requires a free Yelp Fusion API key: https://www.yelp.com/developers

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root (gitignored):
   ```
   YELP_API_KEY=your_yelp_key_here
   ```
3. Start the dev server:
   ```bash
   npm start
   ```
   Opens http://localhost:3000.

> **Note:** `start` and `build` run with `--openssl-legacy-provider` (via `cross-env`) so webpack 4 works on Node 17+.

## Deployment

**Frontend → GitHub Pages:**

```bash
npm run deploy
```

Builds and publishes `build/` to the `gh-pages` branch.

**API proxy → Cloudflare Worker:** see [`worker/README.md`](worker/README.md). Set the `YELP_API_KEY` secret on the Worker, then put its URL in `.env.production`:

```
REACT_APP_YELP_PROXY=https://your-worker.workers.dev
```

## Project structure

```
src/
  components/
    App/           app shell + state
    SearchBar/     term, location, and sort inputs
    BusinessList/  renders the list of results
    Business/      single result card
  util/Yelp.js     API request + response mapping
  setupProxy.js    dev-only Yelp proxy
worker/            Cloudflare Worker (production proxy)
```
