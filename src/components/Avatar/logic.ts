//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface Avatar extends AvatarProps {}
export interface AvatarProps extends BaseComponentProps {
	/**
	 * The color of the avatar.
	 */
	color?:
		| 'black'
		| 'red'
		| 'orange'
		| 'amber'
		| 'yellow'
		| 'lime'
		| 'green'
		| 'emerald'
		| 'teal'
		| 'cyan'
		| 'sky'
		| 'blue'
		| 'indigo'
		| 'violet'
		| 'purple'
		| 'fuchsia'
		| 'pink'
		| 'rose';

	/**
	 * The size of the avatar.
	 */
	size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Custom avatar component based on the Preline UI design system.
 */
export class Avatar extends PrimitiveComponent {
	protected static readonly templateName: string = 'avatar-template';
	protected static readonly forwardedAttributes: Array<keyof AvatarProps> = ['class', 'color', 'size'];
	protected static readonly defaultProperties: AvatarProps = {
		color: 'red',
		size: 'sm',
	};
	protected static readonly colors: Array<AvatarProps['color']> = [
		'black',
		'red',
		'orange',
		'amber',
		'yellow',
		'lime',
		'green',
		'emerald',
		'teal',
		'cyan',
		'sky',
		'blue',
		'indigo',
		'violet',
		'purple',
		'fuchsia',
		'pink',
		'rose',
	];

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes] as string[];
	}

	constructor() {
		super({
			elementName: 'span',
			defaultProperties: Avatar.defaultProperties,
		});
	}

	randomizeColor(): void {
		const randomColor = Avatar.colors[Math.floor(Math.random() * Avatar.colors.length)];
		this.color = randomColor;
	}
}

customElements.define('ui-avatar', Avatar);
