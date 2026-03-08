import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['mangogo.babascart.cc.cd'],
    proxy: {
      '^/(auth|posts|comments|likes|collections|tags|mango-moments|notifications)': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
