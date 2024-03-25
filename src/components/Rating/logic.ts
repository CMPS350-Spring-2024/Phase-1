//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

//	Utility Imports
import { clamp } from '@/scripts/utils';

export interface Rating extends Omit<RatingProps, 'onclick'> {}
export interface RatingProps extends BaseComponentProps {
	/**
	 * The rating value.
	 */
	value: '0' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '4.5' | '5';

	/**
	 * Allows the user to change the value of the rating.
	 */
	editable?: boolean;
}

/**
 * Custom rating component based on the Preline UI design system.
 */
export class Rating extends PrimitiveComponent {
	protected static readonly templateName: string = 'rating-template';
	protected static readonly forwardedAttributes: Array<keyof RatingProps> = ['class', 'value', 'editable'];
	protected static readonly defaultProperties: RatingProps = {
		value: '0',
	};

	protected stars: HTMLInputElement[] = [];

	protected valueToIndexMap: Record<RatingProps['value'], number> = {
		'0': 0,
		'0.5': 1,
		'1': 2,
		'1.5': 3,
		'2': 4,
		'2.5': 5,
		'3': 6,
		'3.5': 7,
		'4': 8,
		'4.5': 9,
		'5': 10,
	};
	protected indexToValueMap: Array<RatingProps['value']> = [
		'0',
		'0.5',
		'1',
		'1.5',
		'2',
		'2.5',
		'3',
		'3.5',
		'4',
		'4.5',
		'5',
	];

	constructor() {
		super({
			elementName: 'span',
			defaultProperties: Rating.defaultProperties,
		});

		//	Get all input elements.
		this.stars = Array.from(this.element.querySelectorAll('input[name="rating"]'));

		//	Set the default checked value.
		const index = this.valueToIndexMap[this.value ?? '0'];
		this.stars[index].checked = true;

		//	Set the editable attribute.
		this.stars.forEach((star) => {
			star.disabled = !this.editable;
		});

		//	Whenever the rating is clicked, update the value.
		this.stars.forEach((star, index) => {
			star.addEventListener('change', () => {
				this.value = this.indexToValueMap[index];
			});
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	Set the editable attribute.
		if (name === 'editable') {
			this.stars.forEach((star) => {
				star.disabled = !this.editable;
			});
		}
	}

	setRating = (value: number) => {
		this.value = (Math.round(clamp(value * 2, 0, 10)) / 2).toString().replace('.0', '') as RatingProps['value'];
	};
}

customElements.define('ui-rating', Rating);
