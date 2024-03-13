//	Package Imports
import HSDropdown from '@preline/dropdown';

//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';
import type { ICollectionItem } from 'preline';

export interface Dropdown extends DropdownProps {}
export interface DropdownProps extends BaseComponentProps {
	/**
	 * Should the dropdown be open?
	 */
	'open'?: boolean;

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

		'open',
		'placement',
		'auto-close',
		'strategy',
		'offset',
		'flip',
		'trigger',
	];
	protected static readonly defaultProperties: DropdownProps = {
		'open': false,
		'placement': 'bottom-left',
		'auto-close': 'inside',
		'strategy': 'absolute',
		'offset': 8,
		'flip': true,
		'trigger': 'click',
	};

	protected baseClass: string;

	protected root: HTMLElement | null = null;
	protected toggleButton: HTMLElement | null = null;
	protected menu: HTMLElement | null = null;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes] as string[];
	}

	constructor() {
		super({ defaultProperties: Dropdown.defaultProperties });

		//	Save the reference to the menu and the toggle button
		this.root = this.shadowRoot!.querySelector('.hs-dropdown');
		this.toggleButton = this.shadowRoot!.querySelector<HTMLSlotElement>(
			'[name="toggle"]',
		)!.assignedNodes()[0] as HTMLElement;
		this.menu = this.shadowRoot!.querySelector('.hs-dropdown-menu');

		//	Store the base class of the element
		this.baseClass = this.menu!.className;

		//	If the toggle button is not found, throw an error
		if (!this.toggleButton) {
			throw new Error('No toggle button found');
		}

		//	Add the hs-dropdown-toggle class to the toggle button
		this.toggleButton!.classList.add('hs-dropdown-toggle');

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
		setTimeout(() => {
			new HSDropdown(this.root as any);
			HSDropdown.on('open', this.root!, () => (this.open = true));
			HSDropdown.on('close', this.root!, () => (this.open = false));
		}, 1000);
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the open attribute is changed, either open or close the dropdown
		if (name === 'open') {
			const { element } = HSDropdown.getInstance(this.root!, true) as ICollectionItem<HSDropdown>;
			if (newValue === '') element.open();
			else element.close();
		}

		//	If the attribute is part of the available properties, update the root element's css variables
		if (Dropdown.forwardedAttributes.includes(name as any)) {
			const value = newValue === '' ? 'true' : newValue;
			if (name === 'class') this.menu!.setAttribute(name, `${this.baseClass} ${value}`);
			else this.root!.style.setProperty(`--${name}`, value);
		}
	}

	show = () => (this.open = true);
	close = () => (this.open = false);
	toggle = () => (this.open = !this.open);
}

customElements.define('ui-dropdown', Dropdown);
