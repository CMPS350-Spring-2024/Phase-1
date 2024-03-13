import legacy from '@vitejs/plugin-legacy';
import posthtml from '@vituum/vite-plugin-posthtml';
import tailwindcss from '@vituum/vite-plugin-tailwindcss';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import tsconfigPaths from 'vite-tsconfig-paths';
import vituum from 'vituum';

export default defineConfig({
	assetsInclude: ['**/*.glb'],
	plugins: [vituum(), posthtml(), legacy(), tsconfigPaths(), tailwindcss(), analyzer({ analyzerMode: 'json' })],
	build: {
		minify: 'terser',
		rollupOptions: {
			input: ['./src/pages/**/*.html'],
			external: ['./src/scripts/buildAnalyzer.mjs'],
		},
	},
});
