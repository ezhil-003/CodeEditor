import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {} // or 'process.env.NODE_ENV': JSON.stringify('development')
  },
  resolve:{
    alias:{
      "@":path.resolve(__dirname , "./src"),
    }
  }
});
