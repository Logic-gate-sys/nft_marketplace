import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path  from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
  server: {
    watch: {
      usePolling: true
     }
  },
  resolve: {
    alias: {
     "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@ether-wallet": path.resolve(__dirname, "./src/ether"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      // For the single file alias:
      "@my-types": path.resolve(__dirname, "./src/services/types.ts"),
    }
  }
})

