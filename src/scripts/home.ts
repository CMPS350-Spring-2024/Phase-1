//	Component Imports
import { Button } from '@/components/Button/logic';
import '@/components/DroneViewer/logic';
import { DroneViewer } from '@/components/DroneViewer/logic';
import { PriceDisplay } from '@/components/PriceDisplay/logic';
import { Rating } from '@/components/Rating/logic';

//	Model Imports
// import { Product } from '@/scripts/models/Product';

//	Utility Imports
import { clamp, find, findAll, formatNumber, startViewTransition } from '@/scripts/utils';

let currentTab: number = 0;
let currentDrone: number = 0;

const droneViewer = find('ui-drone-viewer') as DroneViewer;
const leftCarouselButton = find('#left-arrow-carousel') as Button;
const rightCarouselButton = find('#right-arrow-carousel') as Button;
const viewDetailsButton = find('#view-details-cta') as HTMLButtonElement;
const backButton = find('#back-btn') as HTMLButtonElement;
const seriesDescription = find('#series-description') as HTMLHeadingElement;

const titles = findAll('.product-description .title') as Array<HTMLHeadingElement>;
const ratings = findAll('.product-description .product-rating ui-rating') as Array<Rating>;
const ratingTexts = findAll('.product-description .product-rating p') as Array<HTMLParagraphElement>;
const descriptions = findAll('.product-description .description') as Array<HTMLParagraphElement>;
const prices = findAll('.product-description ui-price-display') as Array<PriceDisplay>;

const tabSelectorLabel = find('#mobile-tab-label') as HTMLHeadingElement;
const leftTabButton = find('#left-arrow-tab') as Button;
const rightTabButton = find('#right-arrow-tab') as Button;
const tabButtons = findAll('.tab-list .tab') as Array<Button>;
const tabContents = findAll('.tab-content') as Array<Button>;

const renderDrone = () => {
	const drone = window.ProductRepository.getProduct(currentDrone) || window.ProductRepository.getProduct(0)!;

	//	Update the model viewer UI
	droneViewer.loadDrone(drone.model);
	seriesDescription.innerHTML = drone.series.description.replace(' ', '<br/>');

	//	Update the product details UI
	titles.forEach((title) => (title.textContent = drone.name));
	ratings.forEach((rating) => rating.setRating(drone.rating));
	ratingTexts.forEach(
		(ratingText) =>
			(ratingText.textContent = `${drone.rating} (${formatNumber(drone.numberOfReviews, 0)} reviews)`),
	);
	descriptions.forEach((description) => (description.textContent = drone.description));
	prices.forEach((price) => price.setPrice(drone.price));
};

const handleViewDetails = () =>
	startViewTransition(() => {
		find('main')!.classList.add('product-overview');
	});

const handleBack = () =>
	startViewTransition(() => {
		find('main')!.classList.remove('product-overview');
	});

const handleChangeDrone = (index: number) => {
	currentDrone = clamp(index, 0, window.ProductRepository.getNumberOfProducts() - 1);
	renderDrone();
};

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
leftCarouselButton.addEventListener('click', () => handleChangeDrone(currentDrone - 1));
leftCarouselButton.addEventListener('touchend', () => handleChangeDrone(currentDrone - 1));
rightCarouselButton.addEventListener('click', () => handleChangeDrone(currentDrone + 1));
rightCarouselButton.addEventListener('touchend', () => handleChangeDrone(currentDrone + 1));
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

//	Render the default drone
renderDrone();
