import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleZebxChat } from './server/zebxChatHandler';
import { handleZebxTranscription } from './server/zebxTranscriptionHandler';

const zebxApiPlugin = (): Plugin => ({
  name: 'zebx-api',
  configureServer(server) {
    server.middlewares.use('/api/chat', handleZebxChat);
    server.middlewares.use('/api/transcribe', handleZebxTranscription);
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;

  return {
    plugins: [react(), zebxApiPlugin()],
    server: {
      port: 3000,
      open: false,
    },
  };
});
