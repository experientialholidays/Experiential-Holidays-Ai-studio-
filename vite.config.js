import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: false
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        contact: resolve(__dirname, 'public/contact.html'),
        dashboard: resolve(__dirname, 'public/dashboard.html'),
        experience: resolve(__dirname, 'public/experience.html'),
        privacy: resolve(__dirname, 'public/privacy.html'),
        submit: resolve(__dirname, 'public/submit.html'),
        terms: resolve(__dirname, 'public/terms.html')
      }
    }
  }
});
