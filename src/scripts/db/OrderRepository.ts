//	Package Imports
import { parse } from 'valibot';

//	Repository Imports
import { BaseRepository } from '@/scripts/db/BaseRepository';

//	Type Imports
import { CreateOrderSchema, Order } from '@/scripts/models/Order';

export type OrderDictionary = Record<number, Order>;
export class OrderRepository extends BaseRepository<Order> {
	protected readonly storageKey: string = 'orders';
	protected readonly repositoryKey: string = 'OrderRepository';

	private get orders(): OrderDictionary {
		return this.getAllOrders();
	}
	private set orders(orders: OrderDictionary) {
		this.items = orders;
	}

	//#region Get
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Get                               */
	/* -------------------------------------------------------------------------- */

	getAllOrders = (): OrderDictionary => this.getAllItems() as OrderDictionary;
	getOrder = (id: number): Order | null => this.getItem(id);
	getNumberOfOrders = (): number => this.getNumberOfItems();

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Add
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Add                               */
	/* -------------------------------------------------------------------------- */

	protected validateAddItem = (order: Order): void => {
		super.validateAddItem(order);

		if (!window.currentUser) throw new Error('You must be logged in to add an order');
		if (order.userId === 0) throw new Error('Only customers can make orders');
		if (order.userId !== window.currentUser.id) throw new Error('Order user id does not match current user id');

		parse(CreateOrderSchema, order);
	};

	addOrder = (order: Order): void => this.addItem(order);
	addDefaultData = async () => {
		if (this.getNumberOfOrders() > 0) return;
		const defaultOrderList = await fetch('/data/default_orders.json').then((response) => response.json());
		defaultOrderList.forEach((orderData: any) => {
			const order = new Order({
				...orderData,
				isParsing: true,
				_dateTime: orderData.dateTime,
				_userId: orderData.userId,
				_estimatedArrival: orderData.estimatedArrival,
				_shippingAddress: orderData.shippingAddress,
			});
			this.addOrder(order);
		});
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	parse = (data: Record<string, any>): Order | null => {
		try {
			const order = new Order({
				_id: data._id,
				productId: data.productId,
				quantity: data.quantity,
				subtotal: data.subtotal,
				shippingFee: data.shippingFee,
				total: data.total,

				isParsing: true,
				_dateTime: data.dateTime,
				_userId: data.userId,
				_estimatedArrival: data.estimatedArrival,
				_shippingAddress: data.shippingAddress,
			});
			return order;
		} catch (error) {
			console.error(`Error parsing order data: ${error}`);
			return null;
		}
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
