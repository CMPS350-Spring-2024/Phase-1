/** @type {import('tailwindcss').Config} */
export default {
	important: true,
	content: ['./src/**/*.{html,js,ts}', 'node_modules/preline/dist/*.js'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Source Sans 3"', 'sans-serif'],
				serif: ['"Source Serif 4"', 'serif'],
				display: ['"Montserrat"', 'sans-serif'],
			},
			strokeWidth: {
				3: '3px',
				4: '4px',
				5: '5px',
				6: '6px',
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('preline/plugin')],
};
