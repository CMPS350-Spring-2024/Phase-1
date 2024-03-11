//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface NavbarProps extends BaseComponentProps {
	test: string;
}

/**
 * Custom navbar component based on the Preline UI design system.
 */
export class Navbar extends BaseComponent {
	protected static readonly templateName: string = 'navbar-template';

	constructor() {
		super({});
	}
}

customElements.define('ui-navbar', Navbar);
