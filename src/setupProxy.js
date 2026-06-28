// Dev-only proxy. Forwards /api/yelp/* to the Yelp API, injecting the
// Authorization header server-side so the key never reaches the browser
// bundle, and so requests are same-origin (no CORS).
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/yelp',
    proxy({
      target: 'https://api.yelp.com',
      changeOrigin: true,
      pathRewrite: { '^/api/yelp': '' },
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    })
  );
};
