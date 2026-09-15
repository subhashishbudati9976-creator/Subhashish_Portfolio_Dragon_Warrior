# ZEBX API Boundary

The frontend service is prepared to call `POST /api/chat` through `src/services/zebxApi.ts`.

## Request

```json
{
  "message": "string",
  "history": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ]
}
```

## Response

```json
{
  "message": "string"
}
```

The current repository is a Vite-only static frontend. It has no server runtime, serverless adapter, API route directory, or deployment configuration for handling `/api/chat`. The endpoint is therefore a provider-agnostic boundary only; it is not implemented in this phase.

A future server-side runtime must keep provider credentials and the ZEBX system prompt on the server. The browser should call only `/api/chat` and must never receive a provider API key.
