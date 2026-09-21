import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: false
  },
  plugins: [
    {
      name: 'experience-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url, 'http://localhost');
          const pathname = url.pathname;
          if ((pathname.startsWith('/experience/') || pathname === '/experience') && !pathname.includes('.')) {
            req.url = '/experience.html' + url.search;
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        about: resolve(__dirname, 'public/about.html'),
        contact: resolve(__dirname, 'public/contact.html'),
        dashboard: resolve(__dirname, 'public/dashboard.html'),
        experience: resolve(__dirname, 'public/experience.html'),
        privacy: resolve(__dirname, 'public/privacy.html'),
        submit: resolve(__dirname, 'public/submit.html'),
        searchAnalytics: resolve(__dirname, 'public/search-analytics.html'),
        terms: resolve(__dirname, 'public/terms.html')
      }
    }
  }
});
