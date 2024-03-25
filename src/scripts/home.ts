//	Component Imports
import { Button } from '@/components/Button/logic';
import '@/components/DroneViewer/logic';
//	Utility Imports
import { find, findAll, formatNumber, startViewTransition } from '@/scripts/utils';

let currentTab: number = 0;

const viewDetailsButton = document.querySelector('#view-details-cta') as HTMLButtonElement;
const backButton = document.querySelector('#back-btn') as HTMLButtonElement;
const tabSelectorLabel = document.querySelector('.tab-selector .tab-title') as HTMLHeadingElement;
const leftTabButton = document.querySelector('.left.tab-arrow-btn') as Button;
const rightTabButton = document.querySelector('.right.tab-arrow-btn') as Button;
const tabButtons = document.querySelectorAll('.tab-list .tab');
const tabContents = document.querySelectorAll('.tab-content');
};

const handleViewDetails = () =>
	startViewTransition(() => {
		find('main')!.classList.add('product-overview');
	});

const handleBack = () =>
	startViewTransition(() => {
		find('main')!.classList.remove('product-overview');
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

//	Add event listeners
viewDetailsButton.addEventListener('click', handleViewDetails);
viewDetailsButton.addEventListener('touchend', handleViewDetails);
backButton.addEventListener('click', handleBack);
backButton.addEventListener('touchend', handleBack);
leftTabButton.addEventListener('click', () => handleChangeTab(currentTab - 1));
leftTabButton.addEventListener('touchend', () => handleChangeTab(currentTab - 1));
rightTabButton.addEventListener('click', () => handleChangeTab(currentTab + 1));
rightTabButton.addEventListener('touchend', () => handleChangeTab(currentTab + 1));
tabButtons.forEach((button, index) => {
	button.addEventListener('click', () => handleChangeTab(index));
	button.addEventListener('touchend', () => handleChangeTab(index));
});
