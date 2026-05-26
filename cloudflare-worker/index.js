export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ['https://redescubriendo.com', 'https://redescubriendo.pages.dev'];
    const corsOrigin = allowed.some(o => origin.startsWith(o)) ? origin : allowed[0];

    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    try {
      const { messages } = await request.json();

      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages });
      const text = response.response || 'Sin respuesta';

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
