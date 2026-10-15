import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import path from 'node:path'

export default defineConfig(() => {
  const isStatic = process.env.BUILD_STATIC === 'true'

  return {
    base: isStatic ? './' : '/',
    plugins: [
      ...(isStatic
        ? []
        : [
            laravel({
              input: ['src/main.tsx', 'src/index.css'],
              refresh: true,
            }),
          ]),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      host: 'localhost',
      port: 5173,
      cors: true,
    },
  }
})

