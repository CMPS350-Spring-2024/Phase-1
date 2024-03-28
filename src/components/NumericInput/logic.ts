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

	/**
	 * The size of the input.
	 */
	size?: 'sm' | 'md';
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
		'size',
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

	private mouseHoldInterval: number | undefined;

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
		this.decrement?.addEventListener('mousedown', () => this.handleDecrement());
		this.increment?.addEventListener('mousedown', () => this.handleIncrement());
		this.decrement?.addEventListener('touchstart', () => this.handleDecrement(), { passive: true });
		this.increment?.addEventListener('touchstart', () => this.handleIncrement(), { passive: true });
		this.decrement?.addEventListener('mouseup', () => clearInterval(this.mouseHoldInterval));
		this.increment?.addEventListener('mouseup', () => clearInterval(this.mouseHoldInterval));
		this.decrement?.addEventListener('touchend', () => clearInterval(this.mouseHoldInterval));
		this.increment?.addEventListener('touchend', () => clearInterval(this.mouseHoldInterval));
	}

	connectedCallback(): void {
		super.connectedCallback();

		//	Initialize validation
		this.updateInternals();
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		if (name === 'value') (this.element as HTMLInputElement).value = newValue;
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
		if (value === Number(this.value)) return;
		this.value = value;
		this.element.dispatchEvent(new Event('change'));
		this.updateInternals();
	};

	private handleDecrement = () => {
		const decrement = () => {
			(this.element as HTMLInputElement).stepDown();
			this.element.dispatchEvent(new Event('input'));
			this.handleValueChange();
		};

		//	Repeat the decrement action while the button is held down
		decrement();
		this.mouseHoldInterval = setTimeout(() => {
			this.mouseHoldInterval = setInterval(decrement, 75);
		}, 400);
	};

	private handleIncrement = () => {
		const increment = () => {
			(this.element as HTMLInputElement).stepUp();
			this.element.dispatchEvent(new Event('input'));
			this.handleValueChange();
		};

		//	Repeat the increment action while the button is held down
		increment();
		this.mouseHoldInterval = setTimeout(() => {
			this.mouseHoldInterval = setInterval(increment, 75);
		}, 400);
	};

	public checkValidity = () => this._internals.checkValidity();
	public reportValidity = () => this._internals.reportValidity();
}

customElements.define('ui-numeric-input', NumericInput);
