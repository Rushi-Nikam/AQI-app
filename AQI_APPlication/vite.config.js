import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/aqi_values': {
        target: 'http://34.30.30.232:8000/',
        changeOrigin: true, 
        secure: false, 
      },
    },
  },
});
