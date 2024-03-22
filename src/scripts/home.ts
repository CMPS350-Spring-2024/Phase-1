//	Component Imports
import '@/components/DroneViewer/logic';

let viewDetailsButton: HTMLButtonElement;
let backButton: HTMLButtonElement;

document.addEventListener('DOMContentLoaded', () => {
	viewDetailsButton = document.querySelector('#view-details-cta') as HTMLButtonElement;
	backButton = document.querySelector('#back-btn') as HTMLButtonElement;

	viewDetailsButton.addEventListener('click', handleViewDetails);
	backButton.addEventListener('click', handleBack);
});

const handleViewDetails = () => {
	//	If the browser doesnt support view transitions
	if (!document.startViewTransition) {
		document.querySelector('main')!.classList.add('product-overview');
		return;
	}

	document.startViewTransition(() => {
		document.querySelector('main')!.classList.add('product-overview');
	});
};

const handleBack = () => {
	//	If the browser doesnt support view transitions
	if (!document.startViewTransition) {
		document.querySelector('main')!.classList.remove('product-overview');
		return;
	}

	document.startViewTransition(() => {
		document.querySelector('main')!.classList.remove('product-overview');
	});
};
