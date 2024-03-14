//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface Button extends Omit<ButtonProps, 'onclick'> {}
export interface ButtonProps extends BaseComponentProps {
	/**
	 * Passes a href to the button, this will wrap the button in an anchor tag.
	 */
	href?: string;

	/**
	 * Specifies where to open the linked document.
	 */
	target?: '_self' | '_blank' | '_parent' | '_top';

	/**
	 * The type of the button.
	 */
	type?: 'button' | 'menu' | 'submit' | 'reset';

	/**
	 * Specifies the fill type of the button.
	 */
	fill?: 'solid' | 'outline' | 'ghost' | 'link';

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

	/**
	 * The function to call when the button is clicked.
	 */
	onclick?: () => void;
}

/**
 * Custom button component based on the Preline UI design system.
 */
export class Button extends PrimitiveComponent {
	protected static readonly templateName: string = 'button-template';
	protected static readonly forwardedAttributes: Array<keyof ButtonProps> = [
		'href',
		'target',
		'type',
		'onclick',

		'class',
		'fill',
		'size',
		'round',
		'disabled',
		'loading',
	];
	protected static readonly defaultProperties: ButtonProps = {
		target: '_self',
		type: 'button',
		fill: 'outline',
		size: 'sm',
	};

	constructor() {
		super({
			elementName: 'button',
			defaultProperties: Button.defaultProperties,
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the href attribute is set, change the role to link if it's not already set, and wrap the button in an anchor tag
		if (name === 'href') {
			if (newValue === null) {
				this.removeAttribute('role');

				//	Unwrap the button from the anchor tag
				const button = this.element.firstElementChild!.cloneNode(true) as HTMLElement;
				button.removeAttribute('tabIndex');
				button.style.removeProperty('width');
				this.element.insertAdjacentElement('afterend', button);
				this.element.remove();
				this.element = button;
			} else {
				this.setAttribute('role', 'link');

				//	Clone the button and make it non-focusable
				const button = this.element.cloneNode(true) as HTMLElement;
				button.setAttribute('tabIndex', '-1');
				button.style.width = '100%';

				//	Wrap the button in an anchor tag
				const anchor = this.element.ownerDocument!.createElement('a');
				anchor.setAttribute('href', newValue);
				anchor.setAttribute('target', this.getAttribute('target')!);
				anchor.appendChild(button);
				this.element.insertAdjacentElement('beforebegin', anchor);
				this.element.remove();
				this.element = anchor;
			}
		}
	}
}

customElements.define('ui-button', Button);
