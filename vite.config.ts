import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Adjust chunk size warning threshold (default: 500 KB)
    chunkSizeWarningLimit: 1000,

    // CSS code splitting enabled by default
    cssCodeSplit: true,

    // Rollup options for advanced chunk optimization
    rollupOptions: {
      output: {
        // Manual chunk separation for vendor libraries
        manualChunks: {
          // MUI stack (Material UI + Icons + Date Pickers)
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@mui/x-date-pickers',
            '@emotion/react',
            '@emotion/styled',
          ],
          // Firebase SDK
          'vendor-firebase': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
          ],
          // React core libraries
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
        },
      },
    },
  },
})
