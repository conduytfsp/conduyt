import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react(),tailwindcss()],
    server: {
      // Only include proxy setup if in development mode
      proxy: isDev ? {
        '/backend_url': {
          target: 'https://conduyt.onrender.com', // Your local Backend port
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/backend_url/, '')
        }
      } : {} // Pass an empty object for production
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@public': path.resolve(__dirname, './public'),
      },
    },
  }
});