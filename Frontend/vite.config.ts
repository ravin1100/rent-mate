import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
  // Disable TypeScript checking during build
  esbuild: {
    // Skip TypeScript type checking
    tsconfigRaw: '{ "compilerOptions": { "jsx": "react-jsx", "skipLibCheck": true, "isolatedModules": true } }'
  }
});
