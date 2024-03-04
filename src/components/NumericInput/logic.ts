//	Package Imports
import '@preline/input-number';
import { HSInputNumber } from 'preline';

//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface NumericInput extends Omit<NumericInputProps, 'autofocus'> {}
export interface NumericInputProps extends BaseComponentProps {
	/**
	 * The name of the input.
	 */
	name?: string;

	/**
	 * The numeric value of the input.
	 */
	value?: number;

	/**
	 * The default value of the input.
	 */
	defaultValue?: number;

	/**
	 * The placeholder text to display when the input is empty.
	 */
	placeholder?: number;

	/**
	 * The minimum value of the input.
	 */
	min?: number;

	/**
	 * The maximum value of the input.
	 */
	max?: number;

	/**
	 * The step value of the input.
	 */
	step?: number;

	/**
	 * Should this input be focused when the page loads?
	 */
	autofocus?: boolean;

	/**
	 * Disables the input.
	 */
	disabled?: boolean;

	/**
	 * Stops the user from being able to change the value of the input.
	 */
	readonly?: boolean;

	/**
	 * If this input is in a form, this property makes it required.
	 */
	required?: boolean;
}

/**
 * Custom numeric input component based on the Preline UI design system.
 */
export class NumericInput extends PrimitiveComponent {
	protected static readonly templateName: string = 'numeric-input-template';
	protected static readonly forwardedAttributes: Array<keyof NumericInputProps> = [
		'class',

		'name',
		'value',
		'defaultValue',
		'placeholder',
		'min',
		'max',
		'step',
		'autofocus',
		'disabled',
		'readonly',
		'required',
	];
	protected static readonly defaultProperties: NumericInputProps = {
		value: 0,
		placeholder: 0,
		min: 0,
		max: 99,
		step: 1,
	};

	protected root: HTMLElement | null = null;
	protected input: HTMLInputElement | null = null;
	protected decrement: HTMLButtonElement | null = null;
	protected increment: HTMLButtonElement | null = null;

	constructor() {
		super({
			elementName: 'input',
			defaultProperties: NumericInput.defaultProperties,
		});

		//	Save the reference to the root element and the buttons
		this.root = this.shadowRoot!.querySelector('[data-hs-input-number]');
		this.input = this.shadowRoot!.querySelector<HTMLInputElement>('[data-hs-input-number-input]');
		this.decrement = this.shadowRoot!.querySelector<HTMLButtonElement>('[data-hs-input-number-decrement]');
		this.increment = this.shadowRoot!.querySelector<HTMLButtonElement>('[data-hs-input-number-increment]');

		//	Add event listener to update the value property when the input changes
		this.root!.addEventListener('change', () => (this.value = this.input!.valueAsNumber));
	}

	connectedCallback(): void {
		super.connectedCallback();

		//	If there is a default value, set it
		if (this.defaultValue) this.value = this.defaultValue;

		//	When everything is loaded, initialize the dropdown
		setTimeout(() => new HSInputNumber(this.root as any), 1000);
	}
}

customElements.define('ui-numeric-input', NumericInput);
