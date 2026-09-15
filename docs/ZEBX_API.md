# ZEBX API Boundary

The frontend service is prepared to call `POST /api/chat` through `src/services/zebxApi.ts`.
The provider boundary is prepared in `server/zebxGeminiProvider.ts` using Google's official `@google/genai` SDK and the Interactions API.

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

The current repository is a Vite-only static frontend. It has no server runtime, serverless adapter, API route directory, or deployment configuration for handling `/api/chat`. The provider module is therefore not wired to a running endpoint in this phase.

The provider uses `gemini-3.5-flash-lite`, reads `GEMINI_API_KEY` only from the server environment, sends `store: false`, and returns safe errors for invalid requests, missing configuration, provider failures, and empty responses.

The server module is intentionally not imported by React or Vite client code. A future deployment runtime must mount it behind `POST /api/chat` and translate its result to this contract.

A future server-side runtime must keep provider credentials and the ZEBX system prompt on the server. The browser should call only `/api/chat` and must never receive a provider API key.
