//	Component Imports
import { Button } from '@/components/Button/logic';
import '@/components/DroneViewer/logic';

//	Utility Imports
import { clamp, find, findAll, startViewTransition } from '@/scripts/_utils';

let currentTab: number = 0;

const viewDetailsButton = find('#view-details-cta') as HTMLButtonElement;
const backButton = find('#back-btn') as HTMLButtonElement;
const tabSelectorLabel = find('#mobile-tab-label') as HTMLHeadingElement;
const leftTabButton = find('#left-arrow-tab') as Button;
const rightTabButton = find('#right-arrow-tab') as Button;
const tabButtons = findAll('.tab-list .tab') as Array<Button>;
const tabContents = findAll('.tab-content') as Array<Button>;

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
	index = clamp(index, 0, tabButtons.length - 1);
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
find('main')!.classList.add('product-overview');
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
