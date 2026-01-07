import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/IWC423-Team01/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
