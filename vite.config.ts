import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['lucide-react', 'motion'],
          'vendor-pdf': ['jspdf'],
          'vendor-markdown': ['react-markdown', 'remark-gfm']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
