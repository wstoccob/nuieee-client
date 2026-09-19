import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                // Library code changes far less often than app code, so giving it its
                // own chunks lets returning visitors reuse the cached copy.
                manualChunks: {
                    react: ["react", "react-dom", "react-router-dom"],
                    data: ["@tanstack/react-query", "axios"],
                    carousel: ["react-slick", "slick-carousel"],
                    motion: ["framer-motion"],
                },
            },
        },
    },
})
