export class BaseComponent extends HTMLElement {
	private static observedAttributes: string[] = [];
	private debug: boolean = false;

	//	Create a new instance of the component
	constructor(debug: boolean = false) {
		super();
		this.debug = debug;

		//	Loop through each of the observed attributes and reflect them to element attributes
		BaseComponent.observedAttributes.forEach((property) => {
			Object.defineProperty(this, property, {
				get() {
					return this.getAttribute(property);
				},
				set(value) {
					if (value) {
						this.setAttribute(property, value);
					} else {
						this.removeAttribute(property);
					}
				},
			});
		});
	}

	//	When the component is added to the page
	connectedCallback() {
		//	Get the component template and replace all the slots with the content
		const template = document.querySelector<HTMLTemplateElement>('#preline-button-template')!.content;
		const newComponent = document.importNode(template, true);
		newComponent.querySelectorAll('slot').forEach((slot) => {
			//	If this is the default slot (ie not named), then fill it with the innerHTML of the custom element
			if (slot.name === '') {
				slot.innerHTML = this.innerHTML;
			}

			//	Otherwise, fill it with the named slot content
			else {
				const namedSlotContent = this.querySelector(`[slot="${slot.name}"]`);
				if (namedSlotContent) {
					slot.innerHTML = namedSlotContent.innerHTML;
				}
			}
		});

		//	Remove the old content and add the new component
		this.innerHTML = '';
		this.appendChild(newComponent);

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
