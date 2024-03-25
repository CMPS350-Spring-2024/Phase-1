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

	static formAssociated = true;
	private _defaultValue: number | undefined;
	private _internals: ElementInternals;

	public get valueAsNumber(): number {
		return Number(this.value!);
	}
	public get form(): HTMLFormElement | null {
		return this._internals.form;
	}
	public get validity(): ValidityState {
		return this._internals.validity;
	}
	public get willValidate(): boolean {
		return this._internals.willValidate;
	}
	public get validationMessage(): string {
		return this._internals.validationMessage;
	}

	constructor() {
		super({
			elementName: 'input',
			defaultProperties: NumericInput.defaultProperties,
		});

		//	Set the default value to within the min/max range
		if (this.value! < this.min!) this.value = this.min!;
		else if (this.value! > this.max!) this.value = this.max!;
		this.element.setAttribute('value', this.value!.toString());

		//	Allow the input to be associated with a form
		this._defaultValue = this.valueAsNumber;
		this._internals = this.attachInternals();

		//	Save the reference to the root element and the buttons
		this.root = this.find('[part="root"]');
		this.decrement = this.find<HTMLButtonElement>('#decrement-button');
		this.increment = this.find<HTMLButtonElement>('#increment-button');

		//	Add event listener to update the value property when the input changes and to increment/decrement the value
		this.element.addEventListener('change', () => this.handleValueChange());
		this.decrement?.addEventListener('click', () => this.handleDecrement());
		this.increment?.addEventListener('click', () => this.handleIncrement());
	}

	connectedCallback(): void {
		super.connectedCallback();

		//	Initialize validation
		this.updateInternals();
	}

	formDisabledCallback(disabled: boolean): void {
		this.disabled = disabled;
	}

	formResetCallback(): void {
		this.value = this._defaultValue;
		this.updateInternals();
	}

	formStateRestoreCallback(state: string): void {
		this.value = Number(state);
		this.updateInternals();
	}

	private updateInternals(): void {
		this._internals.setFormValue(this.value?.toString() || null);
		this._internals.setValidity(
			(this.element as HTMLInputElement).validity,
			(this.element as HTMLInputElement).validationMessage,
			this.element!,
		);
	}

	private handleValueChange = () => {
		const value = (this.element as HTMLInputElement).valueAsNumber;
		this.value = value;
		this.updateInternals();
	};

	private handleDecrement = () => {
		(this.element as HTMLInputElement).stepDown();
		this.updateInternals();
	};

	private handleIncrement = () => {
		(this.element as HTMLInputElement).stepUp();
		this.updateInternals();
	};

	public checkValidity = () => this._internals.checkValidity();
	public reportValidity = () => this._internals.reportValidity();
}

customElements.define('ui-numeric-input', NumericInput);
