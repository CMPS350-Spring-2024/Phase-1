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
		'value',
		'defaultValue',
		'placeholder',
		'autofocus',
		'disabled',
		'readonly',
		'required',
	];
	protected static readonly defaultProperties: TextInputProps = {
		placeholder: 'Enter text...',
	};

	constructor() {
		super({
			elementName: 'input',
			defaultProperties: TextInput.defaultProperties,
		});

		//	Add event listener to update the value property when the input changes
		this.element.addEventListener('change', () => (this.value = (this.element as HTMLInputElement).value));
	}
}

customElements.define('ui-text-input', TextInput);
