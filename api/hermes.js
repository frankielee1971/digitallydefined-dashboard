/**
 * Hermes Handler - Direct OpenRouter + Qwen 2.5 Integration
 * - Chat mode: Direct LLM calls via OpenRouter
 * - Action mode: Proxy to backend (unchanged)
 */

export default async function handler(req, res) {
  // === CORS Configuration ===
  const allowedOrigins = [
    'https://dashboard.digitallydefined.online',
    'https://digitallydefined.online',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  const origin = req.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin)
    ? origin
    : 'https://dashboard.digitallydefined.online';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  // === Preflight ===
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // === Method Validation ===
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // === API Key Validation ===
  const provided = req.headers['x-api-key'] || '';
  const expected = (process.env.DASHBOARD_API_KEY || process.env.VITE_DASHBOARD_API_KEY || '').trim();

  if (!expected || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });
  }

  try {
    // === Parse Request Body ===
    const body = req.body || {};
    
    // Ensure body is an object
    if (typeof body !== 'object' || body === null) {
      return res.status(400).json({ 
        error: 'Invalid request body - must be JSON object' 
      });
    }

    const action = typeof body.action === 'string' ? body.action : '';

    // === ACTION MODE - Proxy to Backend ===
    // (These are API calls, not LLM calls)
    if (action && action !== 'chat') {
      const getActions = new Set([
        'dashboard',
        'automation.list',
        'automation.logs',
        'automation.events',
        'status',
        'test-env',
        'auth.verify',
        'ai.recommendations',
        'brain.brief',
        'sheets',
      ]);

      const method = getActions.has(action) ? 'GET' : 'POST';
      const hermesEndpoint = (process.env.HERMES_BACKEND_URL || 'https://digitallydefined-os-backend.vercel.app').replace(/\/$/, '');
      const { action: _action, ...payload } = body;

      try {
        const response = await fetch(`${hermesEndpoint}/api?action=${encodeURIComponent(action)}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': expected,
          },
          ...(method === 'POST' ? { body: JSON.stringify(payload) } : {}),
          signal: AbortSignal.timeout(30000),
        });

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          return res.status(response.status || 500).json({
            error: 'Backend returned non-JSON output',
            detail: text.slice(0, 500),
            status: response.status
          });
        }

        if (!response.ok) {
          return res.status(response.status).json({
            error: data?.error || data?.message || 'Backend request failed',
            detail: text.slice(0, 500),
            status: response.status
          });
        }

        return res.status(200).json(data);
      } catch (proxyError) {
        console.error('[Hermes] Proxy error:', proxyError);
        return res.status(502).json({
          error: 'Backend service unreachable',
          detail: proxyError?.message || 'Failed to connect to backend',
          action: action
        });
      }
    }

    // === CHAT MODE - Direct OpenRouter + Qwen 2.5 ===
    // Validate OpenRouter API key
    const openRouterKey = (process.env.OPENROUTER_API_KEY || '').trim();
    if (!openRouterKey) {
      return res.status(500).json({
        error: 'OpenRouter API key not configured',
        detail: 'Set OPENROUTER_API_KEY in Vercel environment variables'
      });
    }

    // Model configuration - Qwen 2.5 via OpenRouter
    const model = process.env.HERMES_MODEL || 'qwen/qwen2.5-14b-instruct';
    const openRouterEndpoint = 'https://openrouter.ai/api/v1/chat/completions';

    // Extract messages - support multiple formats
    let messages = [];
    
    if (Array.isArray(body.messages)) {
      messages = body.messages;
    } else if (body.message) {
      messages = [{ role: 'user', content: body.message }];
    } else if (body.prompt) {
      messages = [{ role: 'user', content: body.prompt }];
    } else {
      return res.status(400).json({
        error: 'Missing messages, message, or prompt in request body'
      });
    }

    // Ensure we have at least one message
    if (messages.length === 0) {
      return res.status(400).json({
        error: 'No messages provided'
      });
    }

    // Add system message for context
    const systemMessage = {
      role: 'system',
      content: 'You are Hermes, a helpful AI assistant for the DigitallyDefined dashboard. Provide concise, actionable responses.'
    };
    
    // Filter out empty messages and add system message
    const filteredMessages = [systemMessage, ...messages.filter(m => m?.content || m?.text)];

    try {
      const response = await fetch(openRouterEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://dashboard.digitallydefined.online',
          'X-Title': 'DigitallyDefined Hermes',
        },
        body: JSON.stringify({
          model: model,
          messages: filteredMessages.map(msg => ({
            role: msg.role,
            content: msg.content || msg.text || ''
          })),
          temperature: 0.7,
          max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(60000),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData?.error?.message || 
                        responseData?.message || 
                        `OpenRouter error: ${response.status}`;
        console.error('[Hermes] OpenRouter error:', errorMsg, responseData);
        return res.status(response.status || 500).json({
          error: 'AI provider error',
          detail: errorMsg,
          provider: 'OpenRouter',
          status: response.status
        });
      }

      // Extract assistant's reply
      const assistantMessage = responseData?.choices?.[0]?.message?.content || 
                              responseData?.choices?.[0]?.text || 
                              '';

      if (!assistantMessage) {
        return res.status(500).json({
          error: 'Empty response from AI provider',
          detail: 'No content in AI response',
          provider: 'OpenRouter'
        });
      }

      // Format response for frontend compatibility
      return res.status(200).json({
        reply: assistantMessage,
        model: model,
        provider: 'OpenRouter',
        usage: responseData?.usage
      });

    } catch (llmError) {
      console.error('[Hermes] LLM error:', llmError);
      
      if (llmError.name === 'TimeoutError' || llmError.name === 'AbortError') {
        return res.status(504).json({
          error: 'AI response timeout',
          detail: 'Request took too long - please try again',
          provider: 'OpenRouter'
        });
      }

      if (llmError.code === 'ENOTFOUND' || llmError.code === 'ECONNREFUSED') {
        return res.status(502).json({
          error: 'AI provider unreachable',
          detail: 'Cannot connect to OpenRouter',
          provider: 'OpenRouter'
        });
      }

      return res.status(500).json({
        error: 'AI processing error',
        detail: llmError?.message || 'Unknown error in AI generation',
        provider: 'OpenRouter'
      });
    }

  } catch (error) {
    console.error('[Hermes] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      detail: error?.message || 'Unknown error'
    });
  }
}
