//	Component Imports
import { Button } from '@/components/Button/logic';
import '@/components/DroneViewer/logic';

let currentTab: number = 0;

let viewDetailsButton: HTMLButtonElement;
let backButton: HTMLButtonElement;
let tabButtons: NodeListOf<Button>;
let tabContents: NodeListOf<HTMLElement>;

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('main')!.classList.add('product-overview');
	viewDetailsButton = document.querySelector('#view-details-cta') as HTMLButtonElement;
	backButton = document.querySelector('#back-btn') as HTMLButtonElement;
	tabButtons = document.querySelectorAll('.tab-list .tab');
	tabContents = document.querySelectorAll('.tab-content');

	viewDetailsButton.addEventListener('click', handleViewDetails);
	backButton.addEventListener('click', handleBack);
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
	const previousTab = currentTab;
	currentTab = index;

	//	If the tab is already active, return
	if (previousTab === index) return;

	//	Remove active class from previous tab
	tabButtons[previousTab].classList.remove('active');
	tabContents[previousTab].classList.remove('active');

	//	Add active class to new tab
	tabButtons[index].classList.add('active');
	tabContents[index].classList.add('active');
};
