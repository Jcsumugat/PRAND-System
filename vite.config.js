import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/', // 👈 Changed for Railway (remove '/PRAND-System/' for GitHub Pages)
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'], // Keep as is for React
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
    },
});
