import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Local development proxy
      proxy: isDev ? {
        '/api': {
          target: 'http://localhost:8080', // Local Spring Boot backend
          changeOrigin: true,
          secure: false,
        }
      } : {}
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@public': path.resolve(__dirname, './public'),
      },
    },
  }
});