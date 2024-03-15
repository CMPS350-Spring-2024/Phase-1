//	Package Imports
import { throttle } from '@convergence/throttle-utils';

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
	 * The pattern the value must match to be valid, should be a valid Regex matcher.
	 */
	pattern?: string;

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
	 * NOTE: This property should not be set by the user, it is used internally to determine if the input is a password input.
	 */
	isPassword?: boolean;
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
		'placeholder',
		'pattern',
		'autofocus',
		'disabled',
		'readonly',
		'required',

		'isPassword',
	];
	protected static readonly defaultProperties: TextInputProps = {
		type: 'text',
		placeholder: 'Enter text...',
	};

	protected visibilityToggle: HTMLButtonElement | null = null;

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

		//	Allow the input to be associated with a form
		this._defaultValue = this.value;
		this._internals = this.attachInternals();

		//	If this is a password input, find the visibility toggle button and add the isPassword attribute
		if (this.type === 'password') {
			this.isPassword = true;
			this.visibilityToggle = this.shadowRoot?.querySelector(
				'[exportparts="root: visibility-toggle"]',
			) as HTMLButtonElement;
		}

		//	Add event listener to update the value property when the input changes
		this.element.addEventListener(
			'input',
			throttle(() => this.handleValueChange(), 100),
		);
		this.visibilityToggle?.addEventListener('click', () => this.handleToggleVisibility());
		this.element.addEventListener('keydown', (event) => this.handleFormSubmit(event));
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

		//	If the input is a password input, check if the value is valid
		if (this.isPassword) {
			const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
			(this.element as HTMLInputElement).setCustomValidity(
				!regex.test(value) ?
					'Password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, and one number.'
				:	'',
			);
		}

		//	Update the internals
		this.updateInternals();
	};

	private handleFormSubmit = (event: KeyboardEvent) => {
		if (event.key === 'Enter') this._internals.form?.requestSubmit();
	};

	private handleToggleVisibility = () => {
		if (this.isPassword) {
			const eyeIcon = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
			`;
			const eyeOffIcon = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
			`;

			const isHidden = this.type === 'password';
			this.type = isHidden ? 'text' : 'password';
			this.visibilityToggle!.innerHTML = isHidden ? eyeOffIcon : eyeIcon;
		}
	};

	public checkValidity = () => this._internals.checkValidity();
	public reportValidity = () => this._internals.reportValidity();
}

customElements.define('ui-text-input', TextInput);
