//	Repository Imports
import { BaseRepository } from '@/scripts/db/BaseRepository';

//	Type Imports
import { clamp, round } from '@/scripts/_utils';
import { ISeries, Product } from '@/scripts/models/Product';

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
	protected static readonly SHIPPING_CONSTANT: number = 0.01;

	protected _cart: CartData = {
		items: {},
		subtotal: 0,
		shippingFee: 0,
		total: 0,
	};

	private get products(): ProductDictionary {
		return this.getAllProducts();
	}
	private set products(products: ProductDictionary) {
		this.items = products;
	}

	get cart(): CartData {
		return this._cart;
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

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	parse = (data: Record<string, any>): Product | null => {
		try {
			const product = new Product({
				_id: data._id,
				name: data.name,
				description: data.description,
				model: data.model,
				price: data.price,
				quantity: data.quantity,
				weight: data.weight,
				flightTime: data.flightTime,
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

	addProductToCart = (droneId: number, quantity: number = 1) => this.updateItemInCart(droneId, quantity);
	removeProductFromCart = (droneId: number, quantity: number = 1) => this.updateItemInCart(droneId, -quantity);
	private updateItemInCart = (droneId: number, quantity: number) => {
		const droneData = this.getProduct(droneId);
		if (!droneData) throw new Error(`Given drone does not exist: ${droneId}`);

		//	Update the number of items
		const currentQuantity = this._cart.items[droneId] || 0;
		const newQuantity = clamp(currentQuantity + quantity, 0, droneData.quantity);
		if (newQuantity > 0) this._cart.items[droneId] = newQuantity;
		else delete this._cart.items[droneId];

		//	Update the cart total
		const subtotal = droneData.price * (newQuantity - currentQuantity);
		const shipping = droneData.weight * ProductRepository.SHIPPING_CONSTANT * (newQuantity - currentQuantity);
		const total = subtotal + shipping;
		this._cart.subtotal += round(subtotal);
		this._cart.shippingFee += round(shipping);
		this._cart.total += round(total);

		//	Return the new state of the cart
		return this._cart;
	};

	confirmPurchase = () => {
		//	Create new order, transaction, and update product stock
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
