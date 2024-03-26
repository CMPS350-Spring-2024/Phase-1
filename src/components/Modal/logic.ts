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
	protected static readonly forwardedAttributes: Array<keyof ModalProps> = [];
	protected static readonly defaultProperties: ModalProps = {};

	protected showHeader: boolean = false;
	protected showFooter: boolean = false;

	protected toggleButton: HTMLElement | null = null;
	protected modalContainer: HTMLElement | null = null;

	protected header: HTMLElement | null = null;
	protected titleElement: HTMLElement | null = null;
	protected descriptionElement: HTMLElement | null = null;
	protected closeButton: HTMLElement | null = null;

	protected content: HTMLElement | null = null;
	protected footer: HTMLElement | null = null;

	static get observedAttributes() {
		return [
			...super.observedAttributes,
			...this.forwardedAttributes,
			'class',
			'open',
			'title',
			'description',
		] as string[];
	}

	constructor() {
		super({
			elementName: 'dialog',
			defaultProperties: Modal.defaultProperties,
		});

		//	Save the reference to all sub elements
		this.modalContainer = this.find('[part="modal"]');
		this.header = this.find('[part="header"]');
		this.titleElement = this.find('[part="title"]');
		this.descriptionElement = this.find('[part="description"]');
		this.closeButton = this.find('[exportparts="root: close-button"]');
		this.content = this.find('[part="content"]');
		this.footer = this.find('[part="footer"]');
		this.toggleButton = this.find<HTMLSlotElement>('[name="toggle"]')!.assignedNodes()[0] as HTMLElement;

		//	Add on click event listener to the toggle button
		if (this.toggleButton) this.toggleButton.addEventListener('click', () => this.toggle());

		//	When the close button is clicked, close the modal
		if (this.closeButton) this.closeButton.addEventListener('click', () => this.close());

		//	When the modal is closed, remove the open attribute
		this.element.addEventListener('close', () => (this.open = false));
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	Pass class attribute changes to the modal element
		if (name === 'class') {
			this.modalContainer!.className = newValue;
		}

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

		//	Update header if the title or description changes
		if (name === 'title' || name === 'description') {
			this.showHeader = this.title !== undefined;
			if (name === 'title') this.titleElement!.innerText = newValue;
			if (name === 'description') this.descriptionElement!.innerText = newValue;
		}
	}

	show = () => (this.open = true);
	close = () => (this.open = false);
	toggle = () => (this.open = !this.open);
}

customElements.define('ui-modal', Modal);
