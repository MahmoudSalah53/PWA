import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // استخدم المشروع الأساسي (Next.js) على port 3000
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    lib: {
      entry: 'voice-agent-component.ts',
      name: 'VoiceAgent',
      fileName: 'voice-agent',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      }
    }
  },
  plugins: [
    dts({
      rollupTypes: true,
      insertTypesEntry: true
    })
  ]
});

