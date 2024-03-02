//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface ButtonProps extends BaseComponentProps {
	/**
	 * Specifies the color of the button.
	 */
	color?: 'blue';

	/**
	 * Specifies the fill type of the button.
	 */
	fill?: 'solid' | 'outline' | 'ghost';

	/**
	 * Specifies the size of the button.
	 */
	size?: 'sm' | 'md' | 'lg';

	/**
	 * Makes the button have rounded corners.
	 */
	round?: boolean;

	/**
	 * Disables the button and prevents user interaction.
	 */
	disabled?: boolean;

	/**
	 * Shows a loading spinner inside the button.
	 */
	loading?: boolean;
}

/**
 * Custom button component based on the Preline UI design system.
 */
export class Button extends PrimitiveComponent {
	protected static readonly templateName: string = 'button-template';
	protected static readonly forwardedAttributes: Array<keyof ButtonProps> = [
		'class',
		'color',
		'fill',
		'size',
		'round',
		'disabled',
		'loading',
	];
	protected static readonly defaultProperties: ButtonProps = {
		color: 'blue',
		fill: 'outline',
		size: 'sm',
	};

	constructor() {
		super({
			elementName: 'button',
			defaultProperties: Button.defaultProperties,
		});
	}
}

customElements.define('ui-button', Button);
