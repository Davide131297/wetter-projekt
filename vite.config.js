import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/wetter-projekt",
  plugins: [react()],
  define: {
    'process.env': {}
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
