//	Repository Imports
import { BaseRepository, BaseRepositoryEvents } from '@/scripts/db/BaseRepository';

//	Type Imports
import { clamp, round } from '@/scripts/_utils';
import { ISeries, Product } from '@/scripts/models/Product';
import { Transaction } from '@/scripts/models/Transaction';

export type ProductRepositoryEvents = 'cartAdd' | 'cartRemove' | 'cartClear' | 'cartChange' | BaseRepositoryEvents;
export type CartChangeEvent = (droneId: number, oldQuantity: number, newQuantity: number) => void;
export type ProductDictionary = Record<number, Product>;
export interface CartData {
	/**
	 * A dictionary of product ids and the quantity that exists in the cart
	 */
	items: Record<number, number>;
	subtotal: number;
	shippingFee: number;
	total: number;
}
export class ProductRepository extends BaseRepository<Product> {
	protected readonly storageKey: string = 'products';
	protected readonly repositoryKey: string = 'ProductRepository';
	protected static readonly SHIPPING_CONSTANT: number = 0.25;

	protected onAddToCart: Array<CartChangeEvent> = [];
	protected onRemoveFromCart: Array<CartChangeEvent> = [];
	protected onClearCart: Array<Function> = [];

	protected readonly defaultCartData: CartData = {
		items: {},
		subtotal: 0,
		shippingFee: 0,
		total: 0,
	};
	protected _cart: CartData = this.defaultCartData;

	private get products(): ProductDictionary {
		return this.getAllProducts();
	}
	private set products(products: ProductDictionary) {
		this.items = products;
	}

	get cart(): CartData {
		return this._cart;
	}
	get isCartEmpty(): boolean {
		return Object.keys(this._cart.items).length === 0;
	}

	//#region Get
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Get                               */
	/* -------------------------------------------------------------------------- */

	getAllProducts = (): ProductDictionary => this.getAllItems() as ProductDictionary;
	getProduct = (id: number): Product | null => this.getItem(id);
	getNumberOfProducts = (): number => this.getNumberOfItems();

	getAllSeries = (): Array<ISeries> =>
		Object.values(this.products).reduce((acc, product) => {
			if (acc.find((existing) => existing.name === product.series.name)) return acc;
			acc.push(product.series);
			return acc;
		}, [] as Array<ISeries>);

	getProductsBySeries = (seriesName: string): Array<Product> =>
		Object.values(this.products).filter((product) => product.series.name === seriesName);

	getProductsInCart = (): Array<Product> => {
		const productIds = Object.keys(this._cart.items).map((id) => parseInt(id));
		return productIds.map((id) => this.getProduct(id)!);
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Add
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Add                               */
	/* -------------------------------------------------------------------------- */

	addProduct = (product: Product): void => this.addItem(product);
	addDefaultData = async () => {
		//	Add default data if there are no products or if in development mode
		const isDev = import.meta.env.DEV;
		if (!isDev && this.getNumberOfProducts() > 0) return;
		if (isDev) {
			this.products = [];
			this.numberOfItems = 0;
		}

		//	Fetch default product list and add each product to the repository
		const defaultProductList = await fetch('/data/product_list.json').then((response) => response.json());
		defaultProductList.forEach((productData: any) => {
			const product = new Product({
				...productData,
				isParsing: true,
				_rating: productData.rating,
				_numberOfReviews: productData.numberOfReviews,
				_numberOfSales: productData.numberOfSales,
				_numberOfOngoingOrders: productData.numberOfOngoingOrders,
			});
			this.addProduct(product);
		});
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Update
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Update                             */
	/* -------------------------------------------------------------------------- */

	updateItemsList = () => {
		super.updateItemsList();
		this._cart = JSON.parse(window.localStorage.getItem('cart') || JSON.stringify(this.defaultCartData));
	};

	validateUpdateItem = (product: Product): void => {
		super.validateUpdateItem(product);

		//	Make sure only quantity, rating, price, and sales can be updated
	};
	updateProduct = (product: Product): void => this.updateItem(product);

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	listen = (event: ProductRepositoryEvents, func: Function | CartChangeEvent) => {
		super.listen(event as BaseRepositoryEvents, func);

		if (event === 'cartAdd') this.onAddToCart.push(func as CartChangeEvent);
		if (event === 'cartRemove') this.onRemoveFromCart.push(func as CartChangeEvent);
		if (event === 'cartClear') this.onClearCart.push(func as Function);
		if (event === 'cartChange') {
			this.onAddToCart.push(func as CartChangeEvent);
			this.onRemoveFromCart.push(func as CartChangeEvent);
			this.onClearCart.push(func as Function);
		}
	};

	parse = (data: Record<string, any>): Product | null => {
		try {
			const product = new Product({
				_id: data._id,
				name: data.name,
				description: data.description,
				price: data.price,
				quantity: data.quantity,
				weight: data.weight,
				flightTime: data.flightTime,
				imageUrl: data.imageUrl,
				model: data.model,
				series: data.series,
				features: data.features,
				includedItems: data.includedItems,
				faqs: data.faqs,

				isParsing: true,
				_rating: data.rating,
				_numberOfReviews: data.numberOfReviews,
				_numberOfSales: data.numberOfSales,
				_numberOfOngoingOrders: data.numberOfOngoingOrders,
			});
			return product;
		} catch (error) {
			console.error(`Error parsing product data: ${error}`);
			return null;
		}
	};

	addProductToCart = (droneId: number, quantity: number = 1) => this.incrementItemInCart(droneId, quantity);
	removeProductFromCart = (droneId: number, quantity: number = 1) => this.incrementItemInCart(droneId, -quantity);
	private incrementItemInCart = (droneId: number, quantity: number) => {
		const droneData = this.getProduct(droneId);
		if (!droneData) throw new Error(`Given drone does not exist: ${droneId}`);
		if (quantity === 0) return this._cart;

		//	Update the number of items
		const currentQuantity = this._cart.items[droneId] || 0;
		const newQuantity = clamp(currentQuantity + quantity, 0, droneData.quantity);
		if (newQuantity > 0) this._cart.items[droneId] = newQuantity;
		else delete this._cart.items[droneId];

		//	Update the cart total
		const subtotal = droneData.price * (newQuantity - currentQuantity);
		const shipping = droneData.weight * ProductRepository.SHIPPING_CONSTANT * (newQuantity - currentQuantity);
		const total = subtotal + shipping;
		this._cart.subtotal = clamp(this._cart.subtotal + round(subtotal), 0, Infinity);
		this._cart.shippingFee = clamp(this._cart.shippingFee + round(shipping), 0, Infinity);
		this._cart.total = clamp(this._cart.total + round(total), 0, Infinity);

		//	Save the updated cart to local storage
		window.localStorage.setItem('cart', JSON.stringify(this._cart));

		//	Notify listeners that the cart has been updated
		if (quantity > 0) this.onAddToCart.forEach((func) => func(droneId, currentQuantity, newQuantity));
		else this.onRemoveFromCart.forEach((func) => func(droneId, currentQuantity, newQuantity));

		//	Return the new state of the cart
		return this._cart;
	};

	updateItemInCart = (droneId: number, newQuantity: number) =>
		this.incrementItemInCart(droneId, newQuantity - (this._cart.items[droneId] || 0));

	clearCart = () => {
		this._cart = JSON.parse(JSON.stringify(this.defaultCartData));
		window.localStorage.setItem('cart', JSON.stringify(this._cart));
		this.onClearCart.forEach((func) => func());
	};

	confirmPurchase = () => {
		try {
			if (this.isCartEmpty) throw new Error('Cannot checkout with an empty cart');
			if (!window.currentUser) throw new Error('You must be logged in to confirm a purchase');
			if (window.currentUser.isAdmin) throw new Error('Admins cannot make purchases');

			//	Recalculate the total in case there was an error
			const newTotal = Object.entries(this._cart.items).reduce((acc, [droneId, quantity]) => {
				const drone = this.getProduct(Number(droneId))!;
				const subtotal = drone.price * quantity;
				const shipping = drone.weight * ProductRepository.SHIPPING_CONSTANT * quantity;
				return acc + subtotal + shipping;
			}, 0);

			//	Create new order, transaction
			const transaction = new Transaction({ amount: newTotal, type: 'withdrawal' });
			window.TransactionRepository.addTransaction(transaction);
			console.log(transaction);

			//	Update stock and account balance
			window.currentUser.balance -= newTotal;
			Object.entries(this._cart.items).forEach(([droneId, quantity]) => {
				const drone = this.getProduct(Number(droneId))!;
				drone.quantity -= quantity;
				this.updateProduct(drone);
			});

			//	Clear the cart and reload the page
			this.clearCart();
			console.log(this._cart);
		} catch (error) {
			console.error(`There was an error with your purchase: ${error}`);
		}
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
