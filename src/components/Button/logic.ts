import { PrimitiveComponent } from '@/components/PrimitiveComponent';

export const BUTTON_ATTRIBUTES = ['color', 'fill', 'size', 'round', 'disabled', 'loading'];

export interface ButtonProps {
	color?: 'blue';
	fill?: 'solid' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	round?: boolean;
	disabled?: boolean;
	loading?: boolean;
}

export class Button extends PrimitiveComponent {
	protected static readonly stylesHref: string = '/src/components/Button/styles.css';
	protected static readonly forwardedAttributes: string[] = BUTTON_ATTRIBUTES;
	protected static readonly defaultProperties: ButtonProps = {
		color: 'blue',
		fill: 'outline',
		size: 'sm',
	};

	constructor() {
		super({
			elementName: 'button',
			stylesHref: Button.stylesHref,
			defaultProperties: Button.defaultProperties,
		});
	}
}

customElements.define('preline-button', Button);
