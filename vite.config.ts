import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change base to match your GitHub repository name for Pages deployment.
export default defineConfig({
  base: '/Broadcast-x-pro/',
  plugins: [react()],
});
