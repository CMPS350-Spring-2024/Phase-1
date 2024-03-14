//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface Dropdown extends DropdownProps {}
export interface DropdownProps extends BaseComponentProps {
	/**
	 * Should the dropdown be open?
	 */
	open?: boolean;

	/**
	 * Specifies the position of the menu when opened.
	 */
	placement?: 'bottom-left' | 'bottom-right';
}

/**
 * Custom dropdown component based on the Preline UI design system.
 */
export class Dropdown extends BaseComponent {
	protected static readonly templateName: string = 'dropdown-template';
	protected static readonly forwardedProperties: Array<keyof DropdownProps> = ['class', 'placement'];
	protected static readonly defaultProperties: DropdownProps = {
		placement: 'bottom-left',
	};

	protected root: HTMLElement | null = null;
	protected toggleButton: HTMLElement | null = null;
	protected menu: HTMLElement | null = null;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedProperties] as string[];
	}

	constructor() {
		super({ defaultProperties: Dropdown.defaultProperties });

		//	Save the reference to the menu and the toggle button
		this.root = this.shadowRoot!.querySelector('[part="root"]');
		this.toggleButton = this.shadowRoot!.querySelector<HTMLSlotElement>(
			'[name="toggle"]',
		)!.assignedNodes()[0] as HTMLElement;
		this.menu = this.shadowRoot!.querySelector('[part="menu"]');
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the class was changed, forward it to the menu
		if (name === 'class' && this.menu) this.menu.className = newValue;
	}

	show = () => (this.open = true);
	close = () => (this.open = false);
	toggle = () => (this.open = !this.open);
}

customElements.define('ui-dropdown', Dropdown);
