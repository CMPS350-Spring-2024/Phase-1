export interface BaseComponentProps {
	class?: string;
}

export interface BaseComponentConstructor {
	/**
	 * Default properties for the component.
	 */
	defaultProperties?: Record<string, any>;

	/**
	 * Whether or not to log debug messages to the console.
	 */
	debug?: boolean;
}

export class BaseComponent extends HTMLElement {
	protected static readonly templateName: string;
	protected debug: boolean = false;

	//	If any of the following attributes are changed, the attributeChangedCallback will be called
	static get observedAttributes() {
		return ['debug'] as string[];
	}

	//	Create a new instance of the component
	constructor({ defaultProperties }: BaseComponentConstructor) {
		super();

		//	Loop through each of the observed attributes to initialize them
		((this as Object).constructor as any).observedAttributes.forEach((property: string) => {
			//	Set default value for the property if it is not defined
			let value = this.getAttribute(property);
			if (value === undefined || value === null) value = defaultProperties![property];
			if (value !== undefined && value !== null)
				this.setAttribute(property, typeof value === 'boolean' ? '' : value.toString());

			//	Define a getter and setter for each of the class properties to automatically update the attributes
			Object.defineProperty(this, property, {
				configurable: true,
				get() {
					const value = this.getAttribute(property);
					if (value === '') return true;
					return value;
				},
				set(value) {
					if (value !== undefined && value !== null && value !== false) {
						this.setAttribute(property, typeof value === 'boolean' ? '' : value.toString());
					} else {
						this.removeAttribute(property);
					}
				},
			});
		});

		//	Add component attribute to this element
		this.setAttribute('component', '');

		//	If there is a template for this component, attach it to the shadow dom
		if (((this as Object).constructor as any).templateName) {
			//	Try to find component template
			const template = document.querySelector<HTMLTemplateElement>(
				`#${((this as Object).constructor as any).templateName}`,
			)!;

			//	Throw an error if the template is not found
			if (!template) throw new Error(`Template for "${(this as Object).constructor.name}" component not found.`);

			//	Attach component to shadow root
			const shadowRoot = this.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(template.content.cloneNode(true));

			//	Apply tailwind styles to the shadow dom
			const tailwindStyles = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')!;
			const stylesheets = Array.from(tailwindStyles).map((link) => link.cloneNode()) as Array<HTMLLinkElement>;
			shadowRoot.prepend(...stylesheets);
		}
	}

	//	When the component is added to the page
	connectedCallback() {
		if (this.debug) console.log('Custom element added to page.');
	}

	//	When the component is removed from the page
	disconnectedCallback() {
		if (this.debug) console.log('Custom element removed from page.');
	}

	//	When the component is cloned and moved to a new document
	adoptedCallback() {
		if (this.debug) console.log('Custom element moved to new page.');
	}

	//	When an attribute of the component is changed
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (this.debug) console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}.`);
	}
}
