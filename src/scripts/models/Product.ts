//	Repository Imports

//	Model Imports
import { BaseModel } from '@/scripts/models/BaseModel';

export interface Product extends IProduct {}
export interface IProduct {
	/**
	 * The product's name, for example "Mavic 3 Pro"
	 */
	name: string;

	/**
	 * A short description of the product
	 */
	description: string;

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
	 * Maximum flight time in minutes
	 */
	flightTime: number;

	/**
	 * The overall rating of the product, out of 5
	 */
	rating: number;

	/**
	 * The number of reviews
	 */
	numberOfReviews: number;

	/**
	 * The number of sales
	 */
	numberOfSales: number;

	/**
	 * The number of ongoing orders
	 */
	numberOfOngoingOrders: number;

	/**
	 * The 3D model to display for the product
	 */
	model: {
		/**
		 * The URL of the model
		 */
		url: string;

		/**
		 * The position of the model in the scene
		 */
		position: {
			x: number;
			y: number;
			z: number;
		};

		/**
		 * The rotation of the model in degrees
		 */
		rotation: {
			x: number;
			y: number;
			z: number;
		};

		/**
		 * The scale to display the model at
		 */
		scale: number;

		/**
		 * The initial position of the camera
		 */
		cameraPosition: {
			x: number;
			y: number;
			z: number;
		};
	};

	/**
	 * Data on the series of the drone, for example "Mavic" or "Phantom"
	 */
	series: {
		/**
		 * The series' name, for example "Mavic"
		 */
		name: string;

		/**
		 * The model number of the series, for example "3 Pro"
		 */
		model: string;

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

export type IModel = Product['model'];
export type ISeries = Product['series'];
export type IFeature = Product['features'];
export type IIncludedItem = Product['includedItems'];

export class Product extends BaseModel {
	protected static readonly repositoryKey: string = 'ProductRepository';

	constructor(productData: CreateProduct) {
		super(productData);

		this.name = productData.name;
		this.description = productData.description;
		this.model = productData.model;
		this.price = productData.price;
		this.quantity = productData.quantity;
		this.weight = productData.weight;
		this.series = productData.series;
		this.features = productData.features;
		this.includedItems = productData.includedItems;
		this.faqs = productData.faqs;

		//	If we are only parsing the product data, keep it as is
		if (productData.isParsing) {
			this.rating = productData._rating || 0;
			this.numberOfReviews = productData._numberOfReviews || 0;
			this.numberOfSales = productData._numberOfSales || 0;
			this.numberOfOngoingOrders = productData._numberOfOngoingOrders || 0;
		} else this.rating = 0;
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
		| 'model'
		| 'price'
		| 'quantity'
		| 'weight'
		| 'flightTime'
		| 'series'
		| 'features'
		| 'includedItems'
		| 'faqs'
	> {
	/**
	 * Only used when parsing the product data
	 */
	isParsing?: boolean;
	_id?: number;
	_rating?: number;
	_numberOfReviews?: number;
	_numberOfSales?: number;
	_numberOfOngoingOrders?: number;
}
