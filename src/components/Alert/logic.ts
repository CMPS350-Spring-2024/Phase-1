//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

const infoIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
`;
const successIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
`;
const warningIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
`;
const errorIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
`;

export interface Alert extends AlertProps {}
export interface AlertProps extends BaseComponentProps {
	/**
	 * Which type of alert to display.
	 */
	type?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Custom alert component based on the Preline UI design system.
 */
export class Alert extends BaseComponent {
	protected static readonly templateName: string = 'alert-template';
	protected static readonly forwardedProperties: Array<keyof AlertProps> = ['class', 'type'];
	protected static readonly defaultProperties: AlertProps = {
		type: 'error',
	};

	protected root: HTMLElement | null = null;
	protected icon: HTMLElement | null = null;
	protected titleText: string | null = null;
	protected message: HTMLElement | null = null;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedProperties] as string[];
	}

	constructor() {
		super({ defaultProperties: Alert.defaultProperties });

		//	Save the reference to the menu and the toggle button
		this.root = this.shadowRoot!.querySelector('[part="root"]');
		this.icon = this.shadowRoot!.querySelector('[part="icon"]');
		this.titleText =
			this.shadowRoot!.querySelector<HTMLSlotElement>('[part="title"] slot')!.assignedNodes()[0].textContent;
		this.message = this.shadowRoot!.querySelector<HTMLSlotElement>(
			'[part="message"] slot',
		)!.assignedNodes()[0] as HTMLElement;

		//	Update the icon
		this.updateIcon();
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the type was changed, change the icon as well
		if (name === 'type') this.updateIcon();
	}

	updateIcon = () => {
		if (this.icon) {
			if (this.type === 'info') this.icon.innerHTML = infoIcon;
			else if (this.type === 'success') this.icon.innerHTML = successIcon;
			else if (this.type === 'warning') this.icon.innerHTML = warningIcon;
			else if (this.type === 'error') this.icon.innerHTML = errorIcon;
		}
	};
}

customElements.define('ui-alert', Alert);
