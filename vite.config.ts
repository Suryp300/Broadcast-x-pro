import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change base to match your GitHub repository name for Pages deployment.
export default defineConfig({
  base: '/broadcast-builder-pro/',
  plugins: [react()],
});
