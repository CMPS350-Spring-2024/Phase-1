//	Component Imports
import { Avatar } from '@/components/Avatar/logic';
import { Button } from '@/components/Button/logic';
import { Dropdown } from '@/components/Dropdown/logic';
import { PriceDisplay } from '@/components/PriceDisplay/logic';
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Repository Imports

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

//	Utility Imports
import { formatNumber } from '@/scripts/_utils';

export interface Navbar extends NavbarProps {}
export interface NavbarProps extends BaseComponentProps {
	/**
	 * The type of the current page
	 */
	type?: 'hidden' | 'home' | 'customer' | 'admin';
}

/**
 * Custom navbar component based on the Preline UI design system.
 */
export class Navbar extends PrimitiveComponent {
	protected static readonly templateName: string = 'navbar-template';
	protected static readonly forwardedAttributes: Array<keyof NavbarProps> = ['class', 'type'];
	protected static readonly defaultProperties: NavbarProps = {
		type: 'home',
	};

	protected cartDropdown: Dropdown | null = null;
	protected cartItemList: HTMLElement | null = null;
	protected subtotalDisplay: PriceDisplay | null = null;
	protected shippingDisplay: PriceDisplay | null = null;
	protected totalDisplay: PriceDisplay | null = null;

	protected accountDropdown: Dropdown | null = null;
	protected loggedOutContent: HTMLElement | null = null;
	protected loggedInContent: HTMLElement | null = null;
	protected accountButton: Button | null = null;
	protected accountAvatar: Avatar | null = null;
	protected accountName: HTMLElement | null = null;
	protected accountBalance: PriceDisplay | null = null;
	protected customerLinks: HTMLElement | null = null;
	protected adminLinks: HTMLElement | null = null;
	protected logoutButton: Button | null = null;

	static get observedAttributes() {
		return [...super.observedAttributes, ...this.forwardedAttributes] as string[];
	}

	constructor() {
		super({
			elementName: 'header',
			defaultProperties: Navbar.defaultProperties,
		});

		//	Duplicate the tabs into the row container for mobile view
		const navbarTabs = this.element.querySelector('#navbar-tabs');
		const mobileRow = this.element.querySelector('#mobile-row');
		mobileRow!.appendChild(navbarTabs!.cloneNode(true));

		//	Find the ui for the cart dropdown
		this.cartDropdown = this.element.querySelector('ui-dropdown#cart-dropdown');
		this.cartItemList = this.element.querySelector('#item-list');
		this.subtotalDisplay = this.element.querySelector('#subtotal-display');
		this.shippingDisplay = this.element.querySelector('#shipping-display');
		this.totalDisplay = this.element.querySelector('#total-display');

		//	Find the ui for the account dropdown
		this.accountDropdown = this.element.querySelector('ui-dropdown#account-dropdown');
		this.loggedOutContent = this.element.querySelector('#logged-out-content');
		this.loggedInContent = this.element.querySelector('#logged-in-content');
		this.accountButton = this.element.querySelector('ui-button#account-button');
		this.customerLinks = this.element.querySelector('#customer-links');
		this.adminLinks = this.element.querySelector('#admin-links');
		this.logoutButton = this.element.querySelector('ui-button#logout-button');
		if (this.accountButton) {
			this.accountAvatar = this.accountButton.querySelector('ui-avatar');
			this.accountName = this.accountButton.querySelector('#user-name');
			this.accountBalance = this.accountButton.querySelector('ui-price-display');
		}

		//	Add event listener to log out button
		if (this.logoutButton) this.logoutButton.addEventListener('click', window.UserRepository.logoutUser);
	}

	connectedCallback(): void {
		super.connectedCallback();

		//	Show the correct navbar based on the currently signed in user
		window.UserRepository.listen('initialize', () => this.updateAccountNavbar());
		window.UserRepository.listen('authChange', () => this.updateAccountNavbar());

		//	Update the cart dropdown when the cart changes
		window.ProductRepository.listen('initialize', () => this.updateCartDropdown());
		window.ProductRepository.listen('cartChange', () => this.updateCartDropdown());
	}

	/**
	 * Updates the navbar based on the currently signed in user.
	 */
	updateAccountNavbar = () => {
		if (
			!this.loggedOutContent ||
			!this.loggedInContent ||
			!this.accountButton ||
			!this.accountAvatar ||
			!this.accountName ||
			!this.accountBalance ||
			!this.customerLinks ||
			!this.adminLinks
		)
			return;

		//	If the user is not logged in, show the log in and create account button
		if (!window.currentUser) {
			this.loggedOutContent.classList.remove('hidden');
			this.loggedInContent.classList.add('hidden');
		} else {
			this.accountAvatar.innerText = window.currentUser.getAcronym();
			this.accountAvatar.color = window.currentUser.avatarColor;
			this.accountName.innerText = window.currentUser.getName();
			this.accountBalance.innerText = formatNumber(window.currentUser.balance);

			//	If the user is an admin, show the admin links and change the account button
			if (window.currentUser.isAdmin) {
				this.loggedOutContent.classList.add('hidden');
				this.loggedInContent.classList.remove('hidden');

				this.accountButton.href = '/admin/index.html';
				this.adminLinks.classList.remove('hidden');
				this.customerLinks.classList.add('hidden');
			}

			//	If the user is a customer, show the customer links and change the account button
			else {
				this.loggedOutContent.classList.add('hidden');
				this.loggedInContent.classList.remove('hidden');

				this.accountButton.href === '/customer/index.html';
				this.customerLinks.classList.remove('hidden');
				this.adminLinks.classList.add('hidden');
			}
		}
	};

	updateCartDropdown = () => {
		if (!this.cartItemList || !this.subtotalDisplay || !this.shippingDisplay || !this.totalDisplay) return;

		//	Loop through each of the items in the cart
		const outputHtml = Object.entries(window.ProductRepository.cart.items).map(([id, quantity]) => {
			const productData = window.ProductRepository.getProduct(Number(id));
			if (!productData) return;

			//	Create a new item element and return the html
			return `
					<span class="cart-item">
						<img src="/images/Mini 3.webp" />
						<div class="label">
							<h3>${productData.name}</h3>
							<p>DJI</p>
						</div>
						<div class="price">
							<ui-price-display>${formatNumber(productData.price * quantity)}</ui-price-display>
							<ui-numeric-input size="sm" value="${quantity}"></ui-numeric-input>
						</div>
					</span>
				`;
		});

		//	Insert the html into the item list
		this.cartItemList.innerHTML = outputHtml.join('');

		//	Update the subtotal, shipping, and total prices
		const subtotal = window.ProductRepository.cart.subtotal;
		const shipping = window.ProductRepository.cart.shippingFee;
		const total = window.ProductRepository.cart.total;
		this.subtotalDisplay.setPrice(subtotal);
		this.shippingDisplay.setPrice(shipping);
		this.totalDisplay.setPrice(total);
	};
}

customElements.define('ui-navbar', Navbar);
