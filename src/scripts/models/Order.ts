//	Package Imports
import { custom, minValue, notValue, number, object } from 'valibot';

//	Model Imports
import { BaseModel, CreateBase } from '@/scripts/models/BaseModel';
import { Customer, IShippingAddress } from '@/scripts/models/Customer';

export interface Order extends IOrder {}
export interface IOrder {
	/**
	 * The user that made the order
	 */
	userId: number;

	/**
	 * The product id which was bought
	 */
	productId: number;

	/**
	 * The number of products bought
	 */
	quantity: number;

	/**
	 * The subtotal of the order
	 */
	subtotal: number;

	/**
	 * The shipping cost of the order
	 */
	shippingFee: number;

	/**
	 * The total amount of the order
	 */
	total: number;

	/**
	 * The date and time the order was made
	 */
	dateTime: number;

	/**
	 * The estimated arrival date of the order
	 */
	estimatedArrival?: number;

	/**
	 * The final address the order will be delivered to
	 */
	shippingAddress: IShippingAddress;
}

export class Order extends BaseModel {
	protected static readonly repositoryKey: string = 'OrderRepository';

	constructor(orderData: CreateOrder) {
		super(orderData);

		this.productId = orderData.productId;
		this.quantity = orderData.quantity;
		this.subtotal = orderData.subtotal;
		this.shippingFee = orderData.shippingFee;
		this.total = orderData.total;

		const currentUser = (window.currentUser as Customer) || {
			id: 0,
			shippingAddress: { label: 'Unknown Address', street: '', city: '', country: '', url: '' },
		};

		//	If we are only parsing the order data, keep it as is
		if (orderData.isParsing) {
			this.dateTime = orderData._dateTime || Date.now();
			this.userId = orderData._userId || currentUser.id;
			this.estimatedArrival = orderData._estimatedArrival || Date.now();
			this.shippingAddress = orderData._shippingAddress || currentUser.shippingAddress;
		} else {
			this.dateTime = Date.now();
			this.userId = currentUser.id;
			this.estimatedArrival = Date.now() + orderData.shippingFee * 1000 * 60 * 60; //	1 hour per USD
			this.shippingAddress = currentUser.shippingAddress;
		}
	}
}

export interface CreateOrder extends CreateBase, Pick<Order, 'productId' | 'quantity' | 'subtotal' | 'shippingFee' | 'total'> {
	/**
	 * Only used when parsing the order data
	 */
	_userId?: number;
	_dateTime?: number;
	_estimatedArrival?: number;
	_shippingAddress?: IShippingAddress;
}
export const CreateOrderSchema = object(
	{
		userId: number([
			minValue(1, 'Invalid user id found whilst placing a new order'),
			notValue(0, 'Only customers can make orders'),
		]),
		quantity: number([minValue(1, 'Cannot place an order with no items')]),
		subtotal: number([minValue(0, 'Order subtotal cannot be negative')]),
		shippingFee: number([minValue(0, 'Order shipping fee cannot be negative')]),
		total: number([minValue(0, 'Order total cannot be negative')]),
	},
	[custom((order) => order.total >= order.subtotal + order.shippingFee, 'Order total was not calculated correctly')],
);
