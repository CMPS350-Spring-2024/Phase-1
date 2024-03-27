//	Package Imports
import { autoPlacement, autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';

//	Component Imports
import { BaseComponent } from '@/components/BaseComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';
import type { Placement } from '@floating-ui/dom';

export interface Dropdown extends DropdownProps {}
export interface DropdownProps extends BaseComponentProps {
	/**
	 * Should the dropdown be open?
	 */
	open?: boolean;

	/**
	 * The offset of the menu from the toggle button, applied on the main axis.
	 */
	offset?: number;

	/**
	 * Specifies the position of the menu when opened.
	 */
	placement?: 'auto' | Placement;

	/**
	 * Specifies the minimum distance from the edge of the screen.
	 */
	screenPadding?: number;

	/**
	 * Should the dropdown flip when it reaches the edge of the screen? Cannot be used when `placement` is set to `auto`.
	 */
	flip?: boolean;
}

/**
 * Custom dropdown component based on the Preline UI design system.
 */
export class Dropdown extends BaseComponent {
	protected static readonly templateName: string = 'dropdown-template';
	protected static readonly forwardedProperties: Array<keyof DropdownProps> = [
		'class',

		'open',
		'offset',
		'placement',
		'screenPadding',
		'flip',
	];
	protected static readonly defaultProperties: DropdownProps = {
		open: false,
		offset: 4,
		placement: 'auto',
		screenPadding: 8,
		flip: true,
	};

	protected _cleanupFloating: () => void;

	protected root: HTMLElement | null = null;
	protected toggleButton: HTMLElement | null = null;
	protected menu: HTMLElement | null = null;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedProperties] as string[];
	}

	constructor() {
		super({ defaultProperties: Dropdown.defaultProperties });

		//	Save the reference to the menu and the toggle button
		this.root = this.find('[part="root"]');
		this.toggleButton = this.find<HTMLSlotElement>('[name="toggle"]')!.assignedNodes()[0] as HTMLElement;
		this.menu = this.find('[part="menu"]');

		//	Make sure the menu fits in the screen
		this._cleanupFloating = autoUpdate(this.root!, this.menu!, () => {
			computePosition(this.root!, this.menu!, {
				strategy: 'absolute',
				middleware: [
					offset(Number(this.offset)),
					this.placement !== 'auto' && this.flip && flip(),
					this.placement === 'auto' && autoPlacement(),
					shift({ padding: Number(this.screenPadding) }),
					size({
						apply: ({ availableWidth, availableHeight }) => {
							Object.assign(this.menu!.style, {
								maxWidth: `${availableWidth}px`,
								maxHeight: `${availableHeight}px`,
							});
						},
					}),
				],
				...(this.placement !== 'auto' && { placement: this.placement }),
			}).then(({ x, y }) => {
				const roundByDPR = (value: number) => {
					const dpr = window.devicePixelRatio || 1;
					return Math.round(value * dpr) / dpr;
				};
				Object.assign(this.menu!.style, {
					left: '0',
					top: '0',
					transform: `translate(${roundByDPR(x)}px,${roundByDPR(y)}px)`,
				});
			});
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	If the class was changed, forward it to the menu
		if (name === 'class' && this.menu) this.menu.className = newValue;

		//	If the open state was changed, toggle the menu
		if (name === 'open' && this.toggleButton) this.toggleButton.focus();
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this._cleanupFloating();
	}

	toggle = () => (this.open = !this.open);
	show = () => {
		this.open = false;
		this.open = true;
	};
	close = () => {
		this.open = true;
		this.open = false;
	};
}

customElements.define('ui-dropdown', Dropdown);
