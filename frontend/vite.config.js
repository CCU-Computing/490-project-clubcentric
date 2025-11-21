import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Required for Docker
    port: 5173,
    historyApiFallback: true,
    watch: {
      usePolling: true, // Required for Docker on some systems
    }
  }
})

