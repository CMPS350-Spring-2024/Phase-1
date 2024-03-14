//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface Navbar extends NavbarProps {}
export interface NavbarProps extends BaseComponentProps {
	/**
	 * The type of the current page
	 */
	type?: 'hidden' | 'home' | 'customer' | 'admin';
}

/**
 * Custom navbar component based on the Preline UI design system.
 */
export class Navbar extends PrimitiveComponent {
	protected static readonly templateName: string = 'navbar-template';
	protected static readonly forwardedAttributes: Array<keyof NavbarProps> = ['class', 'type'];
	protected static readonly defaultProperties: NavbarProps = {
		type: 'home',
	};

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes] as string[];
	}

	constructor() {
		super({
			elementName: 'header',
			defaultProperties: Navbar.defaultProperties,
		});
	}
}

customElements.define('ui-navbar', Navbar);
