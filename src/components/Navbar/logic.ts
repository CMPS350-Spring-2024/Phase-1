//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface NavbarProps extends BaseComponentProps {}

/**
 * Custom navbar component based on the Preline UI design system.
 */
export class Navbar extends BaseComponent {
	protected static readonly templateName: string = 'navbar-template';
	protected static readonly forwardedAttributes: Array<keyof NavbarProps> = [];
	protected static readonly defaultProperties: NavbarProps = {};

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes] as string[];
	}

	constructor() {
		super({ defaultProperties: Navbar.defaultProperties });
	}
}

customElements.define('ui-navbar', Navbar);
