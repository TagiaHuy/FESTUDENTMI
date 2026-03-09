import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
    ],
    proxy: {
      // Chuyển hướng các request /api sang backend localhost:8081
      '/api': {
        target: 'https://9195-14-162-78-250.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
