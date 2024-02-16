//	Style Imports
import './index.css';
import './style.css';

import { setupCounter } from './counter.ts';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<div>
		<a class="inline size-10" href="https://vitejs.dev" target="_blank">
			<img src="${viteLogo}" class="logo" alt="Vite logo" />
		</a>
		<a class="inline size-10" href="https://www.typescriptlang.org/" target="_blank">
			<img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
		</a>
		<h1 class="text-3xl font-bold underline">Vite + TypeScript</h1>
		<div class="card">
			<button
				id="counter"
				type="button"
				class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-red-500 disabled:opacity-50 disabled:pointer-events-none dark:border-white dark:text-white dark:hover:text-gray-300 dark:hover:border-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
			/>
		</div>
		<p class="read-the-docs">
			Click on the Vite and TypeScript logos to learn more
		</p>
		<div class="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30" role="alert">
			<div class="flex">
				<div class="flex-shrink-0">
				<!-- Icon -->
				<span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
					<svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
				</span>
				<!-- End Icon -->
				</div>
				<div class="ms-3">
				<h3 class="text-gray-800 font-semibold dark:text-white">
					Successfully updated.
				</h3>
				<p class="text-sm text-gray-700 dark:text-gray-400">
					You have successfully updated your email preferences.
				</p>
				</div>
			</div>
		</div>
	</div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
