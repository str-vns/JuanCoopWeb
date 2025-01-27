import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from the `.env` file
dotenv.config({ path: './.env' });

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@src': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@route': path.resolve(__dirname, './src/route'),
      '@utils': path.resolve(__dirname, './src/Utils'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@navigators': path.resolve(__dirname, './src/navigators'),
      '@schared': path.resolve(__dirname, './src/schared'),
      '@Commons': path.resolve(__dirname, './assets'),
    },
  },
  
  base: '/',
  build: {
    outDir: 'dist', 
  },
});