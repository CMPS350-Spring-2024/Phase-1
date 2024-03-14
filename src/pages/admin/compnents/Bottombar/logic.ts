//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface BottombarProps extends BaseComponentProps {}

/**
 * Custom Bottombar component based on the Preline UI design system.
 */
export class Bottombar extends BaseComponent {
	protected static readonly templateName: string = 'Bottombar-template';
	protected static readonly forwardedAttributes: Array<keyof BottombarProps> = [];
	protected static readonly defaultProperties: BottombarProps = {};

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes] as string[];
	}

	constructor() {
		super({ defaultProperties: Bottombar.defaultProperties });
	}
}

customElements.define('ui-bottombar', Bottombar);
