// Cloudflare Worker: Yelp API proxy for the deployed (GitHub Pages) frontend.
//
// Why this exists: GitHub Pages is static-only, so the dev proxy in
// src/setupProxy.js does not run in production. This Worker takes its place:
//   - injects the Authorization header from the YELP_API_KEY secret, so the
//     key never reaches the browser bundle;
//   - adds CORS headers so the static github.io page is allowed to call it.
//
// Deploy: see worker/README.md.

const ALLOWED_ORIGIN = 'https://justinpong.github.io';

function corsHeaders(origin) {
  // Only the GitHub Pages origin is allowed (light abuse guard; Origin can be
  // spoofed by non-browser clients, so this is politeness, not real security).
  const allow = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request.headers.get('Origin') || '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }
    if (!env.YELP_API_KEY) {
      return new Response(
        JSON.stringify({ error: { description: 'YELP_API_KEY secret not set' } }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // Forward path + query straight to Yelp, e.g.
    // /v3/businesses/search?term=...&location=... -> api.yelp.com/v3/...
    const url = new URL(request.url);
    const target = 'https://api.yelp.com' + url.pathname + url.search;

    const yelpResp = await fetch(target, {
      headers: { Authorization: `Bearer ${env.YELP_API_KEY}` },
    });

    return new Response(await yelpResp.text(), {
      status: yelpResp.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};
