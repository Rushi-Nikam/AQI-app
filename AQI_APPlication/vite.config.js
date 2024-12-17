import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

    
      '/aqi_values': {
        target: 'http://34.30.30.232:8000/',
        changeOrigin: true, // Ensures proper header handling
        secure: false, // Only needed if using self-signed SSL certificates
      },
    },
  },
});
