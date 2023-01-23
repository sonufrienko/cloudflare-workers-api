# Serverless API with Cloudflare Workers

## Getting Started

```shell
npm install -g wrangler
wrangler login
wrangler init <YOUR_WORKER>

wrangler secret put POLYGON_API_KEY
wrangler kv:namespace create API_STOCKS
wrangler kv:namespace create API_STOCKS --preview

wrangler dev
wrangler publish
```
