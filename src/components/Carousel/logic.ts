//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';
import { Button } from '@/components/Button/logic';
import { DroneViewer } from '@/components/DroneViewer/logic';
import { PriceDisplay } from '@/components/PriceDisplay/logic';
import { Rating } from '@/components/Rating/logic';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

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

	protected leftArrow: Button;
	protected rightArrow: Button;
	protected leftArrowText: HTMLParagraphElement;
	protected rightArrowText: HTMLParagraphElement;

	protected droneViewer: DroneViewer;
	protected seriesDescription: HTMLHeadingElement;

	protected titles: Array<HTMLHeadingElement>;
	protected ratings: Array<Rating>;
	protected ratingTexts: Array<HTMLParagraphElement>;
	protected descriptions: Array<HTMLParagraphElement>;
	protected prices: Array<PriceDisplay>;

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
		setTimeout(() => this.renderDrone(), 1000);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the drone attribute has changed, update the drone to display
		if (name === 'drone' && oldValue !== newValue) this.handleChangeDrone(newValue as unknown as number);
	}

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

	getDrone = (index = Number(this.drone)) => window.ProductRepository.getProduct(index);
	getPreviousDrone = () => this.getDrone(Number(this.drone) - 1);
	getNextDrone = () => this.getDrone(Number(this.drone) + 1);
	getNumberOfDrones = () => window.ProductRepository.getNumberOfProducts();
	getLastIndex = () => this.getNumberOfDrones() - 1;

	handlePreviousDrone = () => this.handleChangeDrone(Number(this.drone) - 1);
	handleNextDrone = () => this.handleChangeDrone(Number(this.drone) + 1);
	handleChangeDrone = (index: number) => {
		this.drone = clamp(index, 0, this.getLastIndex());
		this.renderDrone();
	};
}

customElements.define('ui-carousel', Carousel);
