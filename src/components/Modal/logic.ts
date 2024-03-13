//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface Modal extends Omit<ModalProps, 'title'> {}
export interface ModalProps extends BaseComponentProps {
	/**
	 * Is the modal currently open?
	 */
	open?: boolean;

	/**
	 * The title of the modal, if none is provided, the header will not be displayed.
	 */
	title?: string;

	/**
	 * The description of the modal
	 */
	description?: string;
}

/**
 * Custom modal component based on the Preline UI design system.
 */
export class Modal extends PrimitiveComponent {
	protected static readonly templateName: string = 'modal-template';
	protected static readonly forwardedAttributes: Array<keyof ModalProps> = ['class'];
	protected static readonly defaultProperties: ModalProps = {};

	protected toggleButton: HTMLElement | null = null;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes, 'open'] as string[];
	}

	constructor() {
		super({
			elementName: 'dialog',
			defaultProperties: Modal.defaultProperties,
		});

		//	Save the reference to the toggle button
		this.toggleButton = this.shadowRoot!.querySelector<HTMLSlotElement>(
			'[name="toggle"]',
		)!.assignedNodes()[0] as HTMLElement;

		//	Add on click event listener to the toggle button
		this.toggleButton.addEventListener('click', () => this.toggle());

		//	When the modal is closed, remove the open attribute
		this.element.addEventListener('close', () => (this.open = false));
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	Override "open" attribute behaviour, should open or close the modal using the methods provided
		if (name === 'open') {
			if (newValue === null) {
				(this.element as HTMLDialogElement).close();
				document.body.style.overflow = 'initial';
			} else {
				(this.element as HTMLDialogElement).showModal();
				document.body.style.overflow = 'hidden';
			}
		}
	}

	show = () => (this.open = true);
	close = () => (this.open = false);
	toggle = () => (this.open = !this.open);
}

customElements.define('ui-modal', Modal);
