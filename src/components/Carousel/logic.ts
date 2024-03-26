//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';
import { Button } from '@/components/Button/logic';
import { DroneViewer } from '@/components/DroneViewer/logic';
import { PriceDisplay } from '@/components/PriceDisplay/logic';
import { Rating } from '@/components/Rating/logic';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';
import type { ISeries, Product } from '@/scripts/models/Product';

//	Utility Imports
import { clamp, find, findAll, formatNumber } from '@/scripts/_utils';

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
	protected descriptions: Array<HTMLParagraphElement>;
	protected prices: Array<PriceDisplay>;

	get currentDrone(): number {
		return Number(this.getAttribute('drone'));
	}
	set currentDrone(value: number) {
		this.drone = value;
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
		this.descriptions = findAll('.product-description .description') as Array<HTMLParagraphElement>;
		this.prices = findAll('.product-description ui-price-display') as Array<PriceDisplay>;

		//	Add the event listeners
		this.leftArrow.addEventListener('click', () => this.handlePreviousDrone());
		this.leftArrow.addEventListener('touchend', () => this.handlePreviousDrone());
		this.rightArrow.addEventListener('click', () => this.handleNextDrone());
		this.rightArrow.addEventListener('touchend', () => this.handleNextDrone());
	}

	connectedCallback(): void {
		super.connectedCallback();
		this.renderCarousel();
		setTimeout(() => this.renderDrone(), 1000);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the drone attribute has changed, update the drone to display
		if (name === 'drone' && oldValue !== newValue) this.handleChangeDrone(newValue as unknown as number);
	}

	renderCarousel = () => {
		//	Figure out which series should be open
		const openIndex = this.series.findIndex(({ name }) => name === this.getDrone()?.series.name);

		//	For each series, create a carousel item and append it to the carousel container
		const outputHtml = this.series
			.map((series, index) => {
				//	If the series is not the open series
				if (index !== openIndex)
					return `<ui-button data-series-index="${index}" exportparts="root: series"></ui-button>`;
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
		this.findAll('ui-button[exportparts="root: series"]').forEach((button) =>
			button.addEventListener('click', (e) => this.handleSetSeries(e)),
		);

		//	Add event listeners to the drone buttons
		this.findAll('ui-button[exportparts="root: drone"]').forEach((button) =>
			button.addEventListener('click', (e) => this.handleSetDrone(e)),
		);
	};

	renderDrone = () => {
		const drone = this.getDrone() || this.getDrone(0)!;
		const previousDrone = this.getPreviousDrone();
		const nextDrone = this.getNextDrone();

		//	Update the model viewer UI
		this.droneViewer.loadDrone(drone.model);
		this.seriesDescription.innerHTML = drone.series.description.replace(' ', '<br/>');

		//	If there are no previous or next drones, hide the arrows, otherwise show them and update the text
		if (!previousDrone) this.leftArrow.classList.add('hidden');
		else {
			this.leftArrow.classList.remove('hidden');
			this.leftArrowText.innerText =
				previousDrone.series.name === drone.series.name ?
					previousDrone.series.model
				:	previousDrone.series.name;
		}
		if (!nextDrone) this.rightArrow.classList.add('hidden');
		else {
			this.rightArrow.classList.remove('hidden');
			this.rightArrowText.innerText =
				nextDrone.series.name === drone.series.name ? nextDrone.series.model : nextDrone.series.name;
		}

		//	Update the product details UI
		this.titles.forEach((title) => (title.textContent = drone.name));
		this.ratings.forEach((rating) => rating.setRating(drone.rating));
		this.ratingTexts.forEach(
			(ratingText) =>
				(ratingText.textContent = `${drone.rating} (${formatNumber(drone.numberOfReviews, 0)} reviews)`),
		);
		this.descriptions.forEach((description) => (description.textContent = drone.description));
		this.prices.forEach((price) => price.setPrice(drone.price));
	};

	getDrone = (index = this.currentDrone) => window.ProductRepository.getProduct(index);
	getPreviousDrone = () => this.getDrone(this.currentDrone - 1);
	getNextDrone = () => this.getDrone(this.currentDrone + 1);
	getNumberOfDrones = () => window.ProductRepository.getNumberOfProducts();
	getLastIndex = () => this.getNumberOfDrones() - 1;

	handlePreviousDrone = () => this.handleChangeDrone(this.currentDrone - 1);
	handleNextDrone = () => this.handleChangeDrone(this.currentDrone + 1);
	handleChangeDrone = (index: number) => {
		this.currentDrone = clamp(index, 0, this.getLastIndex());
		this.renderCarousel();
		this.renderDrone();
	};

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
		const droneIndex = clamp(
			Number(target.dataset.droneIndex) || 0,
			0,
			this.seriesProducts[seriesIndex].length - 1,
		);

		//	Set the current drone to the selected drone
		this.currentDrone = this.seriesProducts[seriesIndex][droneIndex].id;
	};
}

customElements.define('ui-carousel', Carousel);
