//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

//	Utility Imports
import { formatNumber } from '@/scripts/_utils';

export interface PriceDisplay extends PriceDisplayProps {}
export interface PriceDisplayProps extends BaseComponentProps {
	/**
	 * Specifies the size of the price display.
	 */
	size?: 'xs' | 'sm' | 'md' | 'lg';

	/**
	 * Should text reveal animation be enabled?
	 */
	textReveal?: boolean;
}

/**
 * Custom price display component based on the Preline UI design system.
 */
export class PriceDisplay extends PrimitiveComponent {
	protected static readonly templateName: string = 'price-display-template';
	protected static readonly forwardedAttributes: Array<keyof PriceDisplayProps> = ['class', 'size', 'textReveal'];
	protected static readonly defaultProperties: PriceDisplayProps = {
		size: 'sm',
	};

	protected unitElement: HTMLSpanElement;
	protected valueElement: HTMLParagraphElement;

	constructor() {
		super({
			elementName: 'span',
			defaultProperties: PriceDisplay.defaultProperties,
		});
		this.unitElement = this.find('[part="unit"]')!;
		this.valueElement = this.find('[part="value"]')!;

		this.addTextReveal();
	}

	private addTextReveal = () => {
		this.unitElement.querySelector('span')!.classList.remove('text-reveal');
		this.valueElement.querySelector('span')!.classList.remove('text-reveal');
		if (this.textReveal)
			setTimeout(() => {
				this.unitElement.querySelector('span')!.classList.add('text-reveal');
				this.valueElement.querySelector('span')!.classList.add('text-reveal');
			}, 100);
	};

	setPrice = (price: number) => {
		this.valueElement.querySelector('span')!.innerText = formatNumber(price);
		this.addTextReveal();
	};
}

customElements.define('ui-price-display', PriceDisplay);
