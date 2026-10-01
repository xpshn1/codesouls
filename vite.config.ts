/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// Pyodide is served from the app's own files (spec NFR-2): its runtime files are copied to /pyodide/.
const pyodideFiles = [
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
]

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: pyodideFiles.map((file) => ({
        src: `node_modules/pyodide/${file}`,
        dest: 'pyodide',
        rename: { stripBase: true },
      })),
    }),
  ],
  optimizeDeps: { exclude: ['pyodide'] },
  worker: { format: 'es' },
  test: {
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
})
