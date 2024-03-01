//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

export interface ButtonProps {
	color?: 'blue';
	fill?: 'solid' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	round?: boolean;
	disabled?: boolean;
	loading?: boolean;
}

export class Button extends PrimitiveComponent {
	protected static readonly templateName: string = 'button-template';
	protected static readonly forwardedAttributes: string[] = [
		'class',
		'color',
		'fill',
		'size',
		'round',
		'disabled',
		'loading',
	];
	protected static readonly defaultProperties: ButtonProps = {
		color: 'blue',
		fill: 'outline',
		size: 'sm',
	};

	constructor() {
		super({
			elementName: 'button',
			defaultProperties: Button.defaultProperties,
		});
	}
}

customElements.define('ui-button', Button);
