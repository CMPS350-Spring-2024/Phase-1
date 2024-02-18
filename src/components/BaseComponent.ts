export interface BaseComponentProps {
	/**
	 * The path to the styles for the component.
	 */
	stylesHref: string;

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
	protected debug: boolean = false;

	//	If any of the following attributes are changed, the attributeChangedCallback will be called
	static get observedAttributes() {
		return ['debug'] as string[];
	}

	//	Create a new instance of the component
	constructor({ defaultProperties, stylesHref }: BaseComponentProps) {
		super();

		//	Set the default properties
		if (defaultProperties)
			Object.keys(defaultProperties).forEach((property: string) => {
				//	@ts-ignore
				this[property as keyof BaseComponent] = defaultProperties[property];
			});

		//	Loop through each of the observed attributes to initialize them
		((this as Object).constructor as any).observedAttributes.forEach((property: string) => {
			//	Add each of the properties in this class as an attribute on the element
			const value = this[property as keyof BaseComponent];
			if (value !== undefined && value !== null && value !== false)
				this.setAttribute(property, typeof value === 'string' ? value : '');

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
						this.setAttribute(property, typeof value === 'string' ? value : '');
					} else {
						this.removeAttribute(property);
					}
				},
			});
		});

		//	Attach component to shadow root
		const template = document.querySelector<HTMLTemplateElement>('#preline-button-template')!.content;
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(template.cloneNode(true));

		//	Apply tailwind styles to the shadow dom
		const tailwindStyles = document.createElement('link');
		tailwindStyles.setAttribute('rel', 'stylesheet');
		tailwindStyles.setAttribute('href', '/src/styles/index.css');
		shadowRoot.appendChild(tailwindStyles);

		//	Apply component styles to the shadow dom
		const componentStyles = document.createElement('link');
		componentStyles.setAttribute('rel', 'stylesheet');
		componentStyles.setAttribute('href', stylesHref);
		shadowRoot.appendChild(componentStyles);
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
