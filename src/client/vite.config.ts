import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '.'),
			'@shared': path.resolve(__dirname, '../shared'),
		},
	},
	build: {
		outDir: '../../dist/client',
		rollupOptions: {
			input: {
				splash: 'splash.html',
				game: 'index.html',
				creator: 'creator.html',
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name][extname]',
				sourcemapFileNames: '[name].js.map',
			},
		},
	},
});
