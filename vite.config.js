import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/PRAND-System/', // 👈 required for GitHub Pages
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'], // Laravel entry point
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: 'public/build', // 👈 ensures build output goes here
        emptyOutDir: true,
    },
});
