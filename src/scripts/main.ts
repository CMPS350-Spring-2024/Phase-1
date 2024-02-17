//	Package Imports
import '@preline/accordion';
import '@preline/tooltip';

import { setupCounter } from '@/scripts/counter';
import typescriptLogo from '/typescript.svg';
import viteLogo from '/vite.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<div>
		<div class="hs-tooltip inline-block">
			<a class="inline size-10" href="/test.html">
				<img src="${viteLogo}" class="logo" alt="Vite logo" />
			</a>
			<a class="inline size-10" href="https://www.typescriptlang.org/" target="_blank">
				<img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
			</a>
			<h1 class="text-3xl font-bold underline">Vite + TypeScript</h1>
			<a
				href="/test.html"
				class="
					bg-slate-600
					hover:bg-slate-700
					focus:outline-none
					focus:ring-2
					focus:ring-slate-400
					focus:ring-offset-2
					focus:ring-offset-slate-50
					text-white
					font-semibold
					h-12
					px-6
					rounded-lg
					w-full
					flex
					items-center
					justify-center
					sm:w-auto
					dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400
				"
			>
				TailwindCSS Button
			</a>
			<div class="card">
				<button
					id="counter"
					type="button"
					class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-red-500 disabled:opacity-50 disabled:pointer-events-none dark:border-white dark:text-white dark:hover:text-gray-300 dark:hover:border-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
				/>
				<span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700" role="tooltip">
					Tooltip on top
				</span>
			<span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700" role="tooltip">
				Tooltip on top
			</span>
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
		<div class="hs-accordion-group">
			<div class="hs-accordion active" id="hs-basic-heading-one">
				<button class="hs-accordion-toggle hs-accordion-active:text-blue-600 px-6 py-3 inline-flex items-center gap-x-3 text-sm w-full font-semibold text-start text-gray-800 hover:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-gray-200 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" aria-controls="hs-basic-collapse-one">
				<svg class="hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 block size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
				<svg class="hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 hidden size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
				Accordion #1
				</button>
				<div id="hs-basic-collapse-one" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-heading-one">
				<div class="pb-4 px-6">
					<p class="text-sm text-gray-600 dark:text-gray-200">
					It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
					</p>
				</div>
				</div>
			</div>

			<div class="hs-accordion" id="hs-basic-heading-two">
				<button class="hs-accordion-toggle hs-accordion-active:text-blue-600 px-6 py-3 inline-flex items-center gap-x-3 text-sm w-full font-semibold text-start text-gray-800 hover:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-gray-200 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" aria-controls="hs-basic-collapse-two">
				<svg class="hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 block size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
				<svg class="hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 hidden size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
				Accordion #2
				</button>
				<div id="hs-basic-collapse-two" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-heading-two">
				<div class="pb-4 px-6">
					<p class="text-sm text-gray-600 dark:text-gray-200">
					It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
					</p>
				</div>
				</div>
			</div>

			<div class="hs-accordion" id="hs-basic-heading-three">
				<button class="hs-accordion-toggle hs-accordion-active:text-blue-600 px-6 py-3 inline-flex items-center gap-x-3 text-sm w-full font-semibold text-start text-gray-800 hover:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-gray-200 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" aria-controls="hs-basic-collapse-three">
				<svg class="hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 block size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
				<svg class="hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 hidden size-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
				Accordion #3
				</button>
				<div id="hs-basic-collapse-three" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-heading-three">
				<div class="pb-4 px-6">
					<p class="text-sm text-gray-600 dark:text-gray-200">
					It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
					</p>
				</div>
				</div>
			</div>
		</div>
	</div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
