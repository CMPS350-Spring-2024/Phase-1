//	Component Imports
import { Button } from '@/components/Button/logic';
import '@/components/DroneViewer/logic';

let currentTab: number = 0;

let viewDetailsButton: HTMLButtonElement;
let backButton: HTMLButtonElement;
let tabSelectorLabel: HTMLHeadingElement;
let leftTabButton: Button;
let rightTabButton: Button;
let tabButtons: NodeListOf<Button>;
let tabContents: NodeListOf<HTMLElement>;

document.addEventListener('DOMContentLoaded', () => {
	// document.querySelector('main')!.classList.add('product-overview');

	viewDetailsButton = document.querySelector('#view-details-cta') as HTMLButtonElement;
	backButton = document.querySelector('#back-btn') as HTMLButtonElement;
	tabSelectorLabel = document.querySelector('.tab-selector .tab-title') as HTMLHeadingElement;
	leftTabButton = document.querySelector('.left.tab-arrow-btn') as Button;
	rightTabButton = document.querySelector('.right.tab-arrow-btn') as Button;
	tabButtons = document.querySelectorAll('.tab-list .tab');
	tabContents = document.querySelectorAll('.tab-content');

	viewDetailsButton.addEventListener('click', handleViewDetails);
	backButton.addEventListener('click', handleBack);
	leftTabButton.addEventListener('touchend', () => handleChangeTab(currentTab - 1));
	rightTabButton.addEventListener('touchend', () => handleChangeTab(currentTab + 1));
	tabButtons.forEach((button, index) => {
		button.addEventListener('click', () => handleChangeTab(index));
	});
});

const startViewTransition = (callback: () => void) => {
	//	If the browser doesnt support view transitions
	if (!document.startViewTransition) {
		callback();
		return;
	}
	document.startViewTransition(callback);
};

const handleViewDetails = () =>
	startViewTransition(() => {
		document.querySelector('main')!.classList.add('product-overview');
	});

const handleBack = () =>
	startViewTransition(() => {
		document.querySelector('main')!.classList.remove('product-overview');
	});

const handleChangeTab = (index: number) => {
	//	Store the previous tab index and clamp the new index
	const previousTab = currentTab;
	index = Math.min(tabButtons.length - 1, Math.max(0, index));
	currentTab = index;

	//	If the tab is already active, return
	if (previousTab === index) return;

	//	Remove active class from previous tab
	tabButtons[previousTab].classList.remove('active');
	tabContents[previousTab].classList.remove('active');

	//	Add active class to new tab
	tabButtons[index].classList.add('active');
	tabContents[index].classList.add('active');

	//	Update the tab selector label
	tabSelectorLabel.textContent = tabButtons[index].textContent;
};
