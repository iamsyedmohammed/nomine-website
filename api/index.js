import app from '../server.js';

export default (req, res) => {
  if (req.url.includes('/debug-vercel')) {
    return res.status(200).json({
      url: req.url,
      headers: req.headers,
    });
  }

  // Restore req.url from query param or header
  const urlParam = req.url.includes('url=') ? decodeURIComponent(req.url.split('url=')[1].split('&')[0]) : null;
  const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-path'];

  if (urlParam) {
    req.url = urlParam;
  } else if (matchedPath && !matchedPath.includes('/api/index.js')) {
    req.url = matchedPath;
  }

  return app(req, res);
};
