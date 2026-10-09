import app from '../server.js';

export default (req, res) => {
  // Restore original request URL before Express initializes originalUrl and routing
  if (req.url.startsWith('/api/index.js')) {
    const urlParam = req.url.includes('url=') ? decodeURIComponent(req.url.split('url=')[1]) : null;
    if (urlParam) {
      req.url = urlParam;
    } else {
      const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-path'];
      if (matchedPath && matchedPath !== '/api/index.js') {
        req.url = matchedPath;
      }
    }
  }
  return app(req, res);
};
