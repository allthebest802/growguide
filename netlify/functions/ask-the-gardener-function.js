const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: 'API key not configured. Please add ANTHROPIC_API_KEY to your Netlify environment variables.' } })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: { message: 'Invalid request body' } }) };
  }

  const SYSTEM_PROMPT = `You are "Ask the Gardener", the friendly AI gardening advisor for GrowGuide (growguideuk.netlify.app) — a free UK gardening tools website.

Your role:
- Give practical, accurate, friendly UK-specific gardening advice
- Keep answers concise but genuinely helpful (3-6 sentences is ideal for a chat widget)
- Always think in UK seasons, UK climate, UK regions (not US or Australian advice)
- Reference UK-specific products, suppliers or organisations where relevant (RHS, Garden Organic, etc.)
- If asked about pests, diseases, planting times, or companion planting, you can mention that GrowGuide has dedicated tools for these
- Be warm and encouraging — GrowGuide's audience includes beginners
- Never suggest anything harmful to wildlife, children or pets without a clear warning
- If a question is outside gardening entirely, politely redirect

Format: Plain conversational text only. No markdown, no bullet points, no headers — this renders in a small chat bubble.`;

  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: body.messages,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: data,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: { message: 'Request failed: ' + err.message } }),
      });
    });

    req.write(payload);
    req.end();
  });
};
