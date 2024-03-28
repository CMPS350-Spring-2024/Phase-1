//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';
import { Button } from '@/components/Button/logic';
import { DroneViewer } from '@/components/DroneViewer/logic';
import { Dropdown } from '@/components/Dropdown/logic';
import { Navbar } from '@/components/Navbar/logic';
import { NumericInput } from '@/components/NumericInput/logic';
import { PriceDisplay } from '@/components/PriceDisplay/logic';
import { Rating } from '@/components/Rating/logic';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';
import type { ISeries, Product } from '@/scripts/models/Product';

//	Utility Imports
import { clamp, find, findAll, formatNumber, revealWrapper } from '@/scripts/_utils';

export interface Carousel extends CarouselProps {}
export interface CarouselProps extends BaseComponentProps {
	/**
	 * The current drone id that is being displayed
	 */
	drone: number;
}

/**
 * Custom carousel component based on the Preline UI design system.
 */
export class Carousel extends BaseComponent {
	protected static readonly templateName: string = 'carousel-template';
	protected static readonly forwardedProperties: Array<keyof CarouselProps> = ['class', 'drone'];
	protected static readonly defaultProperties: CarouselProps = {
		drone: 0,
	};

	protected currentSeries: number = 0;
	protected series: Array<ISeries> = window.ProductRepository.getAllSeries();
	protected seriesProducts: Array<Array<Product>> = this.series.map((series) =>
		window.ProductRepository.getProductsBySeries(series.name),
	);

	protected leftArrow: Button;
	protected rightArrow: Button;
	protected leftArrowText: HTMLParagraphElement;
	protected rightArrowText: HTMLParagraphElement;
	protected carouselContainer: HTMLElement;

	protected droneViewer: DroneViewer;
	protected seriesDescription: HTMLHeadingElement;

	protected titles: Array<HTMLHeadingElement>;
	protected ratings: Array<Rating>;
	protected ratingTexts: Array<HTMLParagraphElement>;
	protected quantity: HTMLSpanElement;
	protected flightTime: HTMLSpanElement;
	protected weight: HTMLSpanElement;
	protected descriptions: Array<HTMLParagraphElement>;
	protected prices: Array<PriceDisplay>;

	protected quantityInput: NumericInput;
	protected addToCartButton: Button;

	get currentDrone(): number {
		return Number(this.getAttribute('drone'));
	}
	set currentDrone(value: number) {
		this.drone = value;
		this.showLoading();
		setTimeout(() => {
			this.renderCarousel();
			this.renderDetails();
			this.renderDrone();
		}, 700);
	}

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedProperties] as string[];
	}

	constructor() {
		super({ defaultProperties: Carousel.defaultProperties });

		//	Save the reference to elements in the shadow DOM
		this.leftArrow = this.find('[exportparts="root: left-arrow"]') as Button;
		this.rightArrow = this.find('[exportparts="root: right-arrow"]') as Button;
		this.leftArrowText = this.find('[part="left-arrow-text"]') as HTMLParagraphElement;
		this.rightArrowText = this.find('[part="right-arrow-text"]') as HTMLParagraphElement;
		this.carouselContainer = this.find('[part="carousel"]') as HTMLElement;

		//	Save the reference to elements in the parent DOM
		this.droneViewer = find('ui-drone-viewer') as DroneViewer;
		this.seriesDescription = find('#series-description') as HTMLHeadingElement;
		this.titles = findAll('.product-description .title') as Array<HTMLHeadingElement>;
		this.ratings = findAll('.product-description .product-rating ui-rating') as Array<Rating>;
		this.ratingTexts = findAll('.product-description .product-rating p') as Array<HTMLParagraphElement>;
		this.quantity = find('.product-description .quantity.tag') as HTMLSpanElement;
		this.flightTime = find('.product-description .flight-time.tag') as HTMLSpanElement;
		this.weight = find('.product-description .drone-weight.tag') as HTMLSpanElement;
		this.descriptions = findAll('.product-description .description') as Array<HTMLParagraphElement>;
		this.prices = findAll('.product-description ui-price-display') as Array<PriceDisplay>;
		this.quantityInput = find('#add-to-cart-quantity') as NumericInput;
		this.addToCartButton = find('#add-to-cart-cta') as Button;

		//	Add the event listeners
		this.leftArrow.onClick(() => this.handlePreviousDrone());
		this.rightArrow.onClick(() => this.handleNextDrone());
		this.addToCartButton.onClick(() => {
			window.ProductRepository.addProductToCart(this.getDrone()!.id, this.quantityInput.valueAsNumber);
			find<Navbar>('ui-navbar')?.find<Dropdown>('#cart-dropdown')?.show();
		});
	}

	connectedCallback(): void {
		super.connectedCallback();
		this.currentDrone = this.drone;

		//	Whenever the product repository is updated, re-render the home page
		window.ProductRepository.listen('dataChange', () => (this.currentDrone = this.drone));
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the drone attribute has changed, update the drone to display
		if (name === 'drone' && this.currentDrone !== Number(newValue)) this.handleChangeDrone(newValue as unknown as number);
	}

	showLoading = () => {
		find('main')?.classList.add('loading');
		setTimeout(() => find('main')?.classList.add('paused'), 500);
		this.seriesDescription.querySelectorAll('h1').forEach((element) => element.classList.add('loading'));
	};

	hideLoading = () => {
		find('main')?.classList.remove('loading');
		find('main')?.classList.remove('paused');
		this.seriesDescription.querySelectorAll('h1').forEach((element) => {
			element.classList.remove('loading');
			element.classList.remove('paused');
		});
	};

	renderCarousel = () => {
		//	Figure out which series should be open
		const openIndex = this.series.findIndex(({ name }) => name === this.getDrone()?.series.name);

		//	For each series, create a carousel item and append it to the carousel container
		const outputHtml = this.series
			.map((series, index) => {
				//	If the series is not the open series
				if (index !== openIndex) return `<ui-button data-series-index="${index}" exportparts="root: series"></ui-button>`;
				else {
					const seriesProducts = this.seriesProducts[index];

					//	Create a carousel item for each product in the series
					const seriesHtml = seriesProducts
						.map(
							({ id }, productIndex) => `
								<ui-button
								${id}
									${Number(this.currentDrone) === Number(id) ? 'class="size-2.5 border-2 border-blue-400"' : ''}
									data-series-index="${index}"
									data-drone-index="${productIndex}"
									exportparts="root: drone"
								></ui-button>
							`,
						)
						.join('<hr part="series-divider" />');

					//	Return the series HTML
					return `
						<span part="series-container">
							<p part="series-label">${series.name}</p>
							<hr part="series-divider" />
							${seriesHtml}
							<hr part="series-divider" />
						</span>
					`;
				}
			})
			.join('<hr part="divider" />');

		//	Append the output HTML to the carousel container
		this.carouselContainer.innerHTML = outputHtml;

		//	Add event listeners to the series buttons
		this.findAll<Button>('ui-button[exportparts="root: series"]').forEach((button) =>
			button.onClick((e) => this.handleSetSeries(e)),
		);

		//	Add event listeners to the drone buttons
		this.findAll<Button>('ui-button[exportparts="root: drone"]').forEach((button) =>
			button.onClick((e) => this.handleSetDrone(e)),
		);
	};

	renderDrone = () => {
		//	If the drone is not found, call the renderDrone function again when the product repository is initialized
		const drone = this.getDrone();
		if (!drone) window.ProductRepository.listen('initialize', () => this.renderDrone());
		else {
			//	Load the new drone, if the drone viewer isnt ready, wait for it to be ready
			if (this.droneViewer.loadDrone) this.droneViewer.loadDrone(drone, () => this.hideLoading());
			else setTimeout(() => this.droneViewer.loadDrone(drone, () => this.hideLoading()), 1000);
		}
	};

	renderDetails = () => {
		const drone = this.getDrone();
		const previousDrone = this.getPreviousDrone();
		const nextDrone = this.getNextDrone();

		//	If the drone is not found, call the renderDetails function again when the product repository is initialized
		if (!drone) window.ProductRepository.listen('initialize', () => this.renderDetails());
		else {
			//	If there are no previous or next drones, hide the arrows, otherwise show them and update the text
			const previousSeries = previousDrone?.series.name;
			const previousLabel = previousSeries === drone.series.name ? previousDrone?.series.model : previousSeries;
			this.leftArrow.classList.toggle('hidden', previousDrone === undefined);
			this.leftArrowText.innerText = previousLabel || '';
			const nextSeries = nextDrone?.series.name;
			const nextLabel = nextDrone?.series.name === drone.series.name ? nextDrone?.series.model : nextSeries;
			this.rightArrow.classList.toggle('hidden', nextDrone === undefined);
			this.rightArrowText.innerText = nextLabel || '';

			//	Update rating value
			this.ratings.forEach((rating) => rating.setRating(drone.rating));

			//	Update the quantity, flight time, and weight
			this.quantity.innerText = `${formatNumber(drone.quantity, 0)} in stock`;
			this.flightTime.innerText = `${drone.flightTime}m flight time`;
			this.weight.innerText = `${formatNumber(drone.weight, 0)}g drone weight`;

			//	Set max quantity to the available quantity
			this.quantityInput.max = drone.quantity;
			this.quantityInput.value = 1;

			//	Update the series description
			this.seriesDescription.innerHTML = drone.series.description
				.split(' ')
				.map((text) => `<h1 class="loading paused">${text}</h1>`)
				.join('');

			//	Update text elements in home page with reveal animation
			this.prices.forEach((price) => price.setPrice(drone.price));
			this.titles.forEach((title, index) => (title.innerHTML = revealWrapper(drone.name, index)));
			this.descriptions.forEach(
				(description, index) => (description.innerHTML = revealWrapper(drone.description, index, true)),
			);
			this.ratingTexts.forEach(
				(ratingText, index) =>
					(ratingText.innerHTML = revealWrapper(
						`${drone.rating} (${formatNumber(drone.numberOfReviews, 0)} reviews)`,
						index,
					)),
			);
		}
	};

	getDrone = (index = this.currentDrone) => window.ProductRepository.getProduct(index);
	getPreviousDrone = () => this.getDrone(this.currentDrone - 1);
	getNextDrone = () => this.getDrone(this.currentDrone + 1);
	getNumberOfDrones = () => window.ProductRepository.getNumberOfProducts();
	getLastIndex = () => this.getNumberOfDrones() - 1;

	handlePreviousDrone = () => this.handleChangeDrone(this.currentDrone - 1);
	handleNextDrone = () => this.handleChangeDrone(this.currentDrone + 1);
	handleChangeDrone = (index: number) => (this.currentDrone = clamp(index, 0, this.getLastIndex()));

	handleSetSeries = (event: Event) => {
		const target = event.target as HTMLElement;
		const index = clamp(Number(target.dataset.seriesIndex) || 0, 0, this.series.length - 1);

		//	Set the current drone to the closest drone in the selected series
		if (this.currentSeries < index) this.currentDrone = this.seriesProducts[index][0].id;
		else this.currentDrone = this.seriesProducts[index][this.seriesProducts[index].length - 1].id;
	};

	handleSetDrone = (event: Event) => {
		const target = event.target as HTMLElement;
		const seriesIndex = clamp(Number(target.dataset.seriesIndex) || 0, 0, this.series.length - 1);
		const droneIndex = clamp(Number(target.dataset.droneIndex) || 0, 0, this.seriesProducts[seriesIndex].length - 1);

		//	Set the current drone to the selected drone
		this.currentDrone = this.seriesProducts[seriesIndex][droneIndex].id;
	};
}

customElements.define('ui-carousel', Carousel);
