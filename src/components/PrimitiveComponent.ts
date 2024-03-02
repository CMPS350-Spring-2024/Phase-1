import { BaseComponent, BaseComponentConstructor } from '@/components/BaseComponent';

export interface PrimitiveComponentConstructor extends BaseComponentConstructor {
	/**
	 * The element to use for this primitive component.
	 */
	elementName: keyof HTMLElementTagNameMap;
}

export class PrimitiveComponent extends BaseComponent {
	protected static readonly forwardedVariants: string[] = [];
	protected static readonly forwardedAttributes: string[] = [];

	protected baseClass: string;
	protected element: HTMLElement;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedVariants, ...this.forwardedAttributes] as string[];
	}

	//	Whenever a primitive component is created, it will find the element inside the shadow dom and reflect the forwarded variants and attributes to it
	constructor({ elementName, ...props }: PrimitiveComponentConstructor) {
		super(props);

		//	Add primitive attribute to this element
		this.setAttribute('primitive', '');

		//	Find the primitive element inside the template's shadow dom
		this.element = this.shadowRoot!.querySelector(elementName)!;

		//	Store the base class of the element
		this.baseClass = this.element.className;

		//	Reflect forwarded attributes to the element
		((this as Object).constructor as any).forwardedAttributes.forEach((attribute: string) => {
			const value = this[attribute as keyof PrimitiveComponent];
			if (value !== undefined && value !== null && value !== false) {
				if (attribute === 'class') this.element.setAttribute(attribute, `${this.baseClass} ${value}`);
				else this.element.setAttribute(attribute, typeof value === 'boolean' ? '' : (value as string));
			} else {
				if (attribute === 'class') this.element.setAttribute(attribute, this.baseClass);
				else this.element.removeAttribute(attribute);
			}
		});

		//	Reflect forwarded variants to the class list of the element
		((this as Object).constructor as any).forwardedVariants.forEach((variant: string) => {
			this.element.classList.add(`${variant}-${this[variant as keyof PrimitiveComponent]}`);
		});
	}

	//	Whenever a primitive component's attribute is changed, it will update the forwarded variants and attributes on the element
	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		//	Reflect forwarded attributes to the element
		if (((this as Object).constructor as any).forwardedAttributes.includes(name)) {
			if (newValue !== undefined && newValue !== null) {
				if (name === 'class') this.element.setAttribute(name, `${this.baseClass} ${newValue}`);
				else this.element.setAttribute(name, typeof newValue === 'boolean' ? '' : newValue);
			} else {
				if (name === 'class') this.element.setAttribute(name, this.baseClass);
				else this.element.removeAttribute(name);
			}
		}

		//	Reflect forwarded variants to the class list of the element
		if (((this as Object).constructor as any).forwardedVariants.includes(name)) {
			this.element.classList.remove(`${name}-${oldValue || this[name as keyof PrimitiveComponent]}`);
			this.element.classList.add(`${name}-${newValue}`);
		}
	}
}
