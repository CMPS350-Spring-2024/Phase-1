export interface Product extends IProduct {}
export interface IProduct {
	/**
	 * The product's unique identifier
	 */
	id: number;

	/**
	 * The product's name, for example "Mavic 3 Pro"
	 */
	name: string;

	/**
	 * The overall rating of the product, out of 5
	 */
	rating: number;

	/**
	 * A short description of the product
	 */
	description: string;

	/**
	 * The 3D model to display for the product
	 */
	modelUrl: string;

	/**
	 * The product's price
	 */
	price: number;

	/**
	 * The number of units available in stock
	 */
	quantity: number;

	/**
	 * The weight of the product in grams
	 */
	weight: number;

	/**
	 * Data on the series of the drone, for example "Mavic" or "Phantom"
	 */
	series: {
		/**
		 * The series' name, for example "Mavic"
		 */
		name: string;

		/**
		 * A one or two word description of the series, for example "Aerial Photography"
		 */
		description: string;
	};

	/**
	 * The different features of the product
	 */
	features: Array<{
		/**
		 * A short description of the feature
		 */
		name: string;

		/**
		 * The image URL of the feature
		 */
		imageUrl: string;
	}>;

	/**
	 * A list of items that come with the product, for example "Drone, Remote Controller, Battery"
	 */
	includedItems: Array<{
		/**
		 * The name of the item
		 */
		name: string;

		/**
		 * The quantity of the item
		 */
		quantity: number;

		/**
		 * The image URL of the item
		 */
		imageUrl: string;
	}>;

	/**
	 * A list of frequently asked questions about the product
	 */
	faqs: Array<{
		/**
		 * The question
		 */
		question: string;

		/**
		 * The answer
		 */
		answer: string;
	}>;
}

export interface ISeries extends Pick<Product, 'series'> {}
export interface IFeature extends Pick<Product, 'features'> {}
export interface IIncludedItem extends Pick<Product, 'includedItems'> {}

export class Product {
	private _id: number;

	constructor(productData: CreateProduct) {
		this.name = productData.name;
		this.description = productData.description;
		this.modelUrl = productData.modelUrl;
		this.price = productData.price;
		this.quantity = productData.quantity;
		this.weight = productData.weight;
		this.series = productData.series;
		this.features = productData.features;
		this.includedItems = productData.includedItems;
		this.faqs = productData.faqs;

		//	If we are only parsing the user data, keep it as is
		if (productData.isParsing) {
			this._id = productData._id ?? crypto.getRandomValues(new Uint32Array(1))[0];
			this.rating = productData.rating || 0;
		} else {
			this._id = crypto.getRandomValues(new Uint32Array(1))[0];
			this.rating = 0;
		}
	}

	get id(): number {
		return this._id;
	}

	getNumberOfReviews = () => {};
	getReviewList = () => {};

	getNumberOfSales = () => {};
	getSaleHistory = () => {};

	getNumberOfOngoingOrders = () => {};
	getOngoingOrders = () => {};
}

export interface CreateProduct
	extends Pick<
		Product,
		| 'name'
		| 'description'
		| 'modelUrl'
		| 'price'
		| 'quantity'
		| 'weight'
		| 'series'
		| 'features'
		| 'includedItems'
		| 'faqs'
	> {
	/**
	 * Only used when parsing the product data
	 */
	_id?: number;
	isParsing?: boolean;
	rating?: number;
}
