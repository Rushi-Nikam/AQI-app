import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to your Django backend
      '/aqi_values': {
        target: 'http://192.168.40.191:8000/', // Backend server
        changeOrigin: true, // Ensures proper header handling
        secure: false, // Only needed if using self-signed SSL certificates
      },
    },
  },
});
