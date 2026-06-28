# Yelp proxy (Cloudflare Worker)

Production stand-in for `src/setupProxy.js`. Holds the Yelp API key as a secret
and adds CORS so the GitHub Pages frontend can call the Yelp API.

## Option A — Dashboard (no install)

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**.
2. Name it `ravenous-yelp-proxy` → **Deploy** (creates a placeholder).
3. **Edit code** → paste the contents of `yelp-proxy.js` → **Deploy**.
4. Worker → **Settings** → **Variables and Secrets** → **Add** →
   type **Secret**, name `YELP_API_KEY`, value = your Yelp key → **Deploy**.
5. Copy the worker URL: `https://ravenous-yelp-proxy.<your-subdomain>.workers.dev`.

## Option B — CLI (wrangler)

```bash
npm install -g wrangler        # once
cd worker
wrangler login                 # opens browser
wrangler secret put YELP_API_KEY   # paste key when prompted
wrangler deploy                # prints the worker URL
```

## After deploy

Put the worker URL in `.env.production` at the repo root:

```
REACT_APP_YELP_PROXY=https://ravenous-yelp-proxy.<your-subdomain>.workers.dev
```

Then rebuild + redeploy the frontend (`npm run deploy`).

## Test

```
https://<worker-url>/v3/businesses/search?term=tacos&location=NYC&sort_by=best_match
```

Should return JSON with a `businesses` array.
