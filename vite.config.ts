import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {glslify} from 'vite-plugin-glslify'
import commonjs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), commonjs(), glslify()],
})
