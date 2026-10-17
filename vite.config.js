import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works on GitHub Pages (/Portfolio/) and on any
// other static host without changes.
export default defineConfig({
  plugins: [react()],
  base: './',
})
