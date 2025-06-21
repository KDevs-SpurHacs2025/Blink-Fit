import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html', // Main entry for React app popup
        content: './public/content.js', 
      },
      output: {
        // This ensures 'content.js' is output as 'content.bundle.js' directly in 'dist' folder
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'content') {
            return 'content.bundle.js';
          }
          return 'assets/[name]-[hash].js';
        },
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});