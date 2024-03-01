import legacy from '@vitejs/plugin-legacy';
import posthtml from '@vituum/vite-plugin-posthtml';
import tailwindcss from '@vituum/vite-plugin-tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vituum from 'vituum';

export default defineConfig({
	assetsInclude: ['**/*.glb'],
	plugins: [vituum(), posthtml(), legacy(), tsconfigPaths(), tailwindcss()],
	rollupOptions: {
		minify: 'terser',
		input: ['./src/pages/**/*.html'],
	},
	build: {
		cssMinify: 'lightningcss',
	},
});
