import { Router } from 'itty-router';

const router = Router();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export interface Env {
  POLYGON_API_KEY: string;
  API_STOCKS: KVNamespace;
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  // MY_BUCKET: R2Bucket;
}

const getStockBars = async (
  apiKey: string,
  symbol: string = 'TSLA',
  from: string = '2023-01-01',
  to: string = '2023-01-22'
) => {
  const response = await fetch(
    `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`
  );
  return response.json();
};

router.get('/stocks/:symbol', async ({ params }, env: Env, ctx: ExecutionContext) => {
  const symbol = params.symbol;

  let cache = await env.API_STOCKS.get(symbol, { cacheTtl: 3600 });
  if (!cache) {
    const stockBars = await getStockBars(env.POLYGON_API_KEY, symbol);
    cache = JSON.stringify(stockBars);
    await env.API_STOCKS.put(symbol, cache);
  }

  return new Response(cache, {
    headers: {
      'Content-type': 'application/json',
    },
  });
});

router.all('*', () => new Response('Not Found', { status: 404, ...corsHeaders }));

export default {
  fetch: router.handle,
};
