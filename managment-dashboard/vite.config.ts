import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Force build even when TypeScript errors exist
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore type warnings during build
        if (warning.code === 'TS2307' || warning.code?.startsWith('TS')) {
          return
        }
        warn(warning)
      }
    }
  },
  esbuild: {
    // Ignore TypeScript errors
    legalComments: 'none',
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  }
})
