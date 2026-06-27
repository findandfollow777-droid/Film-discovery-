const https = require('https');

exports.handler = async function (event) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let personName, tmdbBio;
  try {
    ({ personName, tmdbBio } = JSON.parse(event.body || '{}'));
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!personName || !tmdbBio || tmdbBio.length < 50) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing personName or usable tmdbBio' }) };
  }

  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 120,
    messages: [{
      role: 'user',
      content: `Write a 2-sentence bio for ${personName} for use in a film discovery app. Focus on what makes them cinematically significant — their range, impact, or defining quality as a filmmaker or performer. Avoid birth dates, nationalities, and biographical trivia. Be punchy and specific. Source material: ${tmdbBio.slice(0, 800)}`
    }]
  });

  const options = {
    method: 'POST',
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
          },
          body: data,
        });
      });
    });
    req.on('error', (err) => {
      resolve({ statusCode: 502, body: JSON.stringify({ error: err.message }) });
    });
    req.write(payload);
    req.end();
  });
};
