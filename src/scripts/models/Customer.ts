//	Model Imports
import { User } from '@/scripts/models/User';

//	Type Imports
import type { CreateUser } from '@/scripts/models/User';

export interface Customer extends ICustomer {}
export interface ICustomer {
	/**
	 * Data for the customer's shipping address, this is optional by default
	 */
	shippingAddress?: {
		/**
		 * A label for the address
		 */
		label: string;

		/**
		 * The street address
		 */
		street: string;

		/**
		 * The city to ship to
		 */
		city: string;

		/**
		 * The country to ship to
		 */
		country: string;

		/**
		 * The google maps link to the address
		 */
		url: string;
	};
}

export type IShippingAddress = Customer['shippingAddress'];

export class Customer extends User {
	protected static readonly repositoryKey: string = 'UserRepository';

	constructor(customerData: CreateCustomer) {
		super(customerData);
		this.shippingAddress = customerData.shippingAddress;
	}

	getTransactionHistory = () => {};
	getOrderHistory = () => {};
}

export interface CreateCustomer extends Pick<Customer, 'shippingAddress'>, CreateUser {}
