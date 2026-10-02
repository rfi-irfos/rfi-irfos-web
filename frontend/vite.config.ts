import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  // VITE_KEEP_DIST=1 (npm run build:fast) keeps the existing dist/ and its prerendered pages, so only
  // the routes passed to prerender.mjs --only= get re-rendered. Default is vite's normal behaviour.
  build: { emptyOutDir: process.env.VITE_KEEP_DIST !== '1' },
})
