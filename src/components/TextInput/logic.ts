//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface TextInput extends Omit<TextInputProps, 'autofocus'> {}
export interface TextInputProps extends BaseComponentProps {
	/**
	 * The name of the input.
	 */
	name?: string;

	/**
	 * The type of the input.
	 */
	type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url';

	/**
	 * The numeric value of the input.
	 */
	value?: string;

	/**
	 * The default value of the input.
	 */
	defaultValue?: string;

	/**
	 * The placeholder text to display when the input is empty.
	 */
	placeholder?: string;

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
 * Custom text input component based on the Preline UI design system.
 */
export class TextInput extends PrimitiveComponent {
	protected static readonly templateName: string = 'text-input-template';
	protected static readonly forwardedAttributes: Array<keyof TextInputProps> = [
		'class',

		'name',
		'type',
		'value',
		'defaultValue',
		'placeholder',
		'autofocus',
		'disabled',
		'readonly',
		'required',
	];
	protected static readonly defaultProperties: TextInputProps = {
		type: 'text',
		placeholder: 'Enter text...',
	};

	static formAssociated = true;
	private _defaultValue: string | undefined;
	private _internals: ElementInternals;

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
			defaultProperties: TextInput.defaultProperties,
		});

		//	Set private properties
		this._defaultValue = this.value;
		this._internals = this.attachInternals();

		//	Add event listener to update the value property when the input changes
		this.element.addEventListener('change', () => this.handleValueChange());
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
		this.value = state;
		this.updateInternals();
	}

	private updateInternals(): void {
		this._internals.setFormValue(this.value || null);
		this._internals.setValidity(
			(this.element as HTMLInputElement).validity,
			(this.element as HTMLInputElement).validationMessage,
			this.element,
		);
	}

	private handleValueChange = () => {
		const value = (this.element as HTMLInputElement).value;
		this.value = value === '' ? undefined : value;
		this.updateInternals();
	};

	public checkValidity = () => this._internals.checkValidity();
	public reportValidity = () => this._internals.reportValidity();
}

customElements.define('ui-text-input', TextInput);
