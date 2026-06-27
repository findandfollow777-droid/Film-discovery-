const https = require('https');

exports.handler = async function (event) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'TMDB_API_KEY not set' }) };
  }

  const params = new URLSearchParams(event.queryStringParameters || {});
  const tmdbPath = params.get('path');
  if (!tmdbPath) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing path param' }) };
  }

  params.delete('path');
  params.set('api_key', apiKey);

  const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}?${params.toString()}`;

  return new Promise((resolve) => {
    https.get(tmdbUrl, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
          },
          body: data,
        });
      });
    }).on('error', (err) => {
      resolve({ statusCode: 502, body: JSON.stringify({ error: err.message }) });
    });
  });
};
