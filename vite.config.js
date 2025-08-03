import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: '/src' }]
    },
    base: '/',
    server: {
      port: Number(env.VITE_PORT) || 5506,
      historyApiFallback: true // Hỗ trợ điều hướng
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            apexcharts: ['react-apexcharts', 'apexcharts']
          }
        }
      }
    }
  }
})
