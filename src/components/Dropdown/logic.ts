//	Package Imports
import HSDropdown from '@preline/dropdown';

//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface DropdownProps extends BaseComponentProps {
	/**
	 * Specifies the position of the menu when opened.
	 */
	'placement'?:
		| 'top'
		| 'top-left'
		| 'top-right'
		| 'bottom'
		| 'bottom-left'
		| 'bottom-right'
		| 'right'
		| 'right-top'
		| 'right-bottom'
		| 'left'
		| 'left-top'
		| 'left-bottom';

	/**
	 * Specifies the zone, when clicked, which will close the menu.
	 */
	'auto-close'?: boolean | 'inside' | 'outside';

	/**
	 * Sets the position to absolute instead of fixed, and removes the transform styles to
	 * position the menu relative to the relative parent block.
	 */
	'strategy'?: 'fixed' | 'absolute';

	/**
	 * Sets the dropdown's bottom or top offset.
	 */
	'offset'?: number;

	/**
	 * Flips the menu's placement when it starts to overlap its reference element.
	 */
	'flip'?: boolean;

	/**
	 * Event to trigger a dropdown.
	 */
	'trigger'?: 'click' | 'hover';
}

/**
 * Custom dropdown component based on the Preline UI design system.
 */
export class Dropdown extends BaseComponent {
	protected static readonly templateName: string = 'dropdown-template';
	protected static readonly forwardedAttributes: Array<keyof DropdownProps> = [
		'class',
		'placement',
		'auto-close',
		'strategy',
		'offset',
		'flip',
		'trigger',
	];
	protected static readonly defaultProperties: DropdownProps = {
		'placement': 'bottom-left',
		'auto-close': 'inside',
		'strategy': 'absolute',
		'offset': 8,
		'flip': true,
		'trigger': 'click',
	};

	protected baseClass: string;

	protected root: HTMLElement | null = null;
	protected toggle: HTMLElement | null = null;
	protected menu: HTMLElement | null = null;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes] as string[];
	}

	constructor() {
		super({ defaultProperties: Dropdown.defaultProperties });

		//	Save the reference to the menu and the toggle button
		this.root = this.shadowRoot!.querySelector('.hs-dropdown');
		this.toggle = this.shadowRoot!.querySelector<HTMLSlotElement>(
			'[name="toggle"]',
		)!.assignedNodes()[0] as HTMLElement;
		this.menu = this.shadowRoot!.querySelector('.hs-dropdown-menu');

		//	Store the base class of the element
		this.baseClass = this.menu!.className;

		//	If the toggle button is not found, throw an error
		if (!this.toggle) {
			throw new Error('No toggle button found');
		}

		//	Add the hs-dropdown-toggle class to the toggle button
		this.toggle!.classList.add('hs-dropdown-toggle');

		//	Loop through each of the properties to initialize them as css variables
		Dropdown.forwardedAttributes.forEach((property: string) => {
			const value = this[property as keyof Dropdown];
			const finalValue = value === '' ? 'true' : (value || 'false').toString();
			if (property === 'class') this.menu!.setAttribute(property, `${this.baseClass} ${finalValue}`);
			else this.root!.style.setProperty(`--${property}`, finalValue);
		});
	}

	connectedCallback(): void {
		super.connectedCallback();

		//	Register this dropdown with the HSDropdown class
		setTimeout(() => new HSDropdown(this.root as any), 1000);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the attribute is part of the available properties, update the root element's css variables
		if (Dropdown.forwardedAttributes.includes(name as any)) {
			const value = newValue === '' ? 'true' : newValue;
			if (name === 'class') this.menu!.setAttribute(name, `${this.baseClass} ${value}`);
			else this.root!.style.setProperty(`--${name}`, value);
		}
	}
}

customElements.define('ui-dropdown', Dropdown);
