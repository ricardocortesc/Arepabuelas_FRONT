import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configuración del proxy para evitar errores de CORS
    // Todas las peticiones a /api serán redirigidas a tu backend de Spring Boot
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // URL de tu backend de Spring Boot
        changeOrigin: true,
        secure: false,
      }
    }
  }
})