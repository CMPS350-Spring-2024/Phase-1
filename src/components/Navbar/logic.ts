//	Component Imports
import { Avatar } from '@/components/Avatar/logic';
import { Button } from '@/components/Button/logic';
import { Dropdown } from '@/components/Dropdown/logic';
import { NumericInput } from '@/components/NumericInput/logic';
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
	protected emptyCart: HTMLElement | null = null;
	protected cartContent: HTMLElement | null = null;
	protected cartItemList: HTMLElement | null = null;
	protected subtotalDisplay: PriceDisplay | null = null;
	protected shippingDisplay: PriceDisplay | null = null;
	protected totalDisplay: PriceDisplay | null = null;
	protected clearCartButton: Button | null = null;
	protected checkoutButton: Button | null = null;

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
		this.emptyCart = this.element.querySelector('#empty-cart');
		this.cartContent = this.element.querySelector('#cart-content');
		this.cartItemList = this.element.querySelector('#item-list');
		this.subtotalDisplay = this.element.querySelector('#subtotal-display');
		this.shippingDisplay = this.element.querySelector('#shipping-display');
		this.totalDisplay = this.element.querySelector('#total-display');
		this.clearCartButton = this.element.querySelector('#clear-cart');
		this.checkoutButton = this.element.querySelector('#checkout');

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

		//	Add event listener to buttons
		if (this.clearCartButton) this.clearCartButton.onClick(window.ProductRepository.clearCart);
		if (this.logoutButton) this.logoutButton.onClick(window.UserRepository.logoutUser);
		if (this.checkoutButton) {
			this.checkoutButton.onClick(window.ProductRepository.confirmPurchase);
			this.checkoutButton.onClick(() => this.cartDropdown!.focus(), true);
		}
	}

	connectedCallback(): void {
		super.connectedCallback();

		//	Show the correct navbar based on the currently signed in user
		window.UserRepository.listen('initialize', () => this.updateAccountNavbar());
		window.UserRepository.listen('authChange', () => this.updateAccountNavbar());

		//	Update the cart dropdown when the cart changes
		window.ProductRepository.listen('initialize', (_, oldV, newV) => this.updateCartDropdown(oldV, newV, false));
		window.ProductRepository.listen('cartChange', (_, oldV, newV) => this.updateCartDropdown(oldV, newV));
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

	updateCartDropdown = (oldValue: number = 0, newValue: number = 0, notify: boolean = true) => {
		if (
			!this.cartItemList ||
			!this.subtotalDisplay ||
			!this.shippingDisplay ||
			!this.totalDisplay ||
			!this.emptyCart ||
			!this.cartContent
		)
			return;

		//	If the cart is empty, hide the cart dropdown
		if (window.ProductRepository.isCartEmpty) {
			this.emptyCart.classList.remove('hidden');
			this.cartContent.classList.add('hidden');
		}

		//	Else, show the cart dropdown
		else {
			this.emptyCart.classList.add('hidden');
			this.cartContent.classList.remove('hidden');

			//	Update the subtotal, shipping, and total prices
			const subtotal = window.ProductRepository.cart.subtotal;
			const shipping = window.ProductRepository.cart.shippingFee;
			const total = window.ProductRepository.cart.total;
			this.subtotalDisplay.setPrice(subtotal);
			this.shippingDisplay.setPrice(shipping);
			this.totalDisplay.setPrice(total);

			//	If there is a new item in the cart, update the item list
			if (oldValue === 0 || newValue === 0) {
				//	Loop through each of the items in the cart
				const outputHtml = Object.entries(window.ProductRepository.cart.items).map(([id, quantity]) => {
					const productData = window.ProductRepository.getProduct(Number(id));
					if (!productData) return;

					//	Create a new item element and return the html
					return `
					<span class="cart-item" data-id="${id}">
						<img src="${productData.imageUrl}" />
						<div class="label">
							<h3>${productData.name}</h3>
							<p>${productData.series.description}</p>
						</div>
						<div class="price">
							<ui-price-display>${formatNumber(productData.price * quantity)}</ui-price-display>
							<ui-numeric-input size="sm" value="${quantity}" max="${productData.quantity}"></ui-numeric-input>
						</div>
					</span>
				`;
				});

				//	Insert the html into the item list
				this.cartItemList.innerHTML = outputHtml.join('');

				//	Add event listeners to the numeric inputs
				const cartItems = Array.from(this.cartItemList.querySelectorAll('.cart-item')) as Array<HTMLElement>;
				cartItems.forEach((cartItem) => {
					const productId = Number(cartItem.dataset.id);
					const productData = window.ProductRepository.getProduct(productId);
					if (!productData) return;

					const numericInput = cartItem.querySelector('ui-numeric-input') as NumericInput;
					numericInput.find('input')!.addEventListener('change', (event) => {
						const target = event.target as HTMLInputElement;
						const newQuantity = target.valueAsNumber;
						window.ProductRepository.updateItemInCart(productId, newQuantity);
					});
				});
			}

			//	Else, update only the numeric inputs and price display
			else {
				const cartItems = Array.from(this.cartItemList.querySelectorAll('.cart-item')) as Array<HTMLElement>;
				cartItems.forEach((cartItem) => {
					const productId = Number(cartItem.dataset.id);
					const productData = window.ProductRepository.getProduct(productId);
					if (!productData) return;

					const numericInput = cartItem.querySelector('ui-numeric-input') as NumericInput;
					const priceDisplay = cartItem.querySelector('ui-price-display') as PriceDisplay;

					numericInput.value = window.ProductRepository.cart.items[productId];
					priceDisplay.setPrice(productData.price * window.ProductRepository.cart.items[productId]);
				});
				return;
			}
		}

		//	Open the cart dropdown
		if (notify) setTimeout(() => this.cartDropdown?.show(), 200);
	};
}

customElements.define('ui-navbar', Navbar);
