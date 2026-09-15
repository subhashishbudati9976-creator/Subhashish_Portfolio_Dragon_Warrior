import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleZebxChat } from './server/zebxChatHandler';

const zebxApiPlugin = (): Plugin => ({
  name: 'zebx-api',
  configureServer(server) {
    server.middlewares.use('/api/chat', handleZebxChat);
  },
});

export default defineConfig({
  plugins: [react(), zebxApiPlugin()],
  server: {
    port: 3000,
    open: false,
  },
});
