import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// This is a JavaScript version of the config file that completely bypasses TypeScript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  server: {
    port: 3000,
    open: true
  },
  // Completely ignore TypeScript errors during build
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },
  // Skip type checking
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx',
          skipLibCheck: true,
          isolatedModules: true,
          target: 'es2020',
          useDefineForClassFields: true,
          allowJs: true
        }
      }
    }
  }
});
