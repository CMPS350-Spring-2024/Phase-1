import { BaseComponent } from '@/components/BaseComponent';

customElements.define(
	'preline-button',
	class extends BaseComponent {
		private disabled: boolean = false;

		constructor(debug: boolean = false) {
			super(debug);
		}
	},
);
