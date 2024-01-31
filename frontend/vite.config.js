import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      "/api": {
        target: "https://mern-thread-hrd.vercel.app/",
        changeOrigin: true,
        // secure: true
      }
    }
  }
})
