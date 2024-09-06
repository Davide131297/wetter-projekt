import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  base: "/wetter-projekt",
  plugins: [react()],
  define: {
    'process.env': {
      REACT_APP_API_KEY: process.env.REACT_APP_API_KEY
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 2000, // Setzt die Warnschwelle auf 2000 kB
  }
})
