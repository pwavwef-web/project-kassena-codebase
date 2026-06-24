/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// TribeStudio workspace — starter Vite configuration.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
  },
})
