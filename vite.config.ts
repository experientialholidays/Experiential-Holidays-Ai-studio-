import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    root: path.resolve(__dirname, 'Ai-studio-exp-holidays-main/public'),
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      host: '0.0.0.0',
      port: 3000
    },
  };
});
