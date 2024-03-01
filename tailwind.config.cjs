/** @type {import('tailwindcss').Config} */
export default {
	important: true,
	content: ['./src/**/*.{html,js,ts}', 'node_modules/preline/dist/*.js'],
	theme: {
		extend: {
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
