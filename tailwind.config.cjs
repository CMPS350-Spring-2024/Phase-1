/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,ts,jsx,tsx}', 'node_modules/preline/dist/*.js'],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/forms'), require('preline/plugin')],
};
