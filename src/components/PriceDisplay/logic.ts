//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface PriceDisplayProps extends BaseComponentProps {
	/**
	 * Specifies the size of the price display.
	 */
	size?: 'sm' | 'md' | 'lg';
}

/**
 * Custom price display component based on the Preline UI design system.
 */
export class PriceDisplay extends PrimitiveComponent {
	protected static readonly templateName: string = 'price-display-template';
	protected static readonly forwardedAttributes: Array<keyof PriceDisplayProps> = ['class', 'size'];
	protected static readonly defaultProperties: PriceDisplayProps = {
		size: 'sm',
	};

	constructor() {
		super({
			elementName: 'span',
			defaultProperties: PriceDisplay.defaultProperties,
		});
	}
}

customElements.define('ui-price-display', PriceDisplay);
