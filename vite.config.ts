import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };
    const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || '';
    const url = env.VITE_SUPABASE_URL || '';
    let publicKey = /^sb_publishable_[A-Za-z0-9_-]+$/.test(key);
    if (key.startsWith('eyJ')) {
      try { publicKey = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role === 'anon'; }
      catch { publicKey = false; }
    }
    if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url) || !publicKey) {
      throw new Error('Production build requires a valid Supabase URL and a publishable (or legacy anon) key.');
    }
  }
  return {
  plugins: [
    react(),
    tailwindcss(),
  ],
  };
})
