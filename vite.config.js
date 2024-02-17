import legacy from '@vitejs/plugin-legacy';
import posthtml from '@vituum/vite-plugin-posthtml';
import tailwindcss from '@vituum/vite-plugin-tailwindcss';
import { defineConfig } from 'vite';
import vituum from 'vituum';

export default defineConfig({
	plugins: [vituum(), posthtml(), tailwindcss(), legacy()],
	rollupOptions: {
		minify: 'terser',
		input: ['./src/pages/**/*.html'],
	},
});
