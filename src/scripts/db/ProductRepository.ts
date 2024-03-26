//	Repository Imports
import { BaseRepository } from '@/scripts/db/BaseRepository';

//	Type Imports
import { ISeries, Product } from '@/scripts/models/Product';

export type ProductDictionary = Record<number, Product>;
export class ProductRepository extends BaseRepository<Product> {
	protected readonly storageKey: string = 'products';
	protected readonly repositoryName: string = 'ProductRepository';

	private get products(): ProductDictionary {
		return this.getAllProducts();
	}
	private set products(products: ProductDictionary) {
		this.items = products;
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
		if (isDev) this.products = [];
		if (!isDev && this.getNumberOfProducts() > 0) return;

		//	Fetch default product list and add each product to the repository
		const defaultProductList = await fetch('/data/product_list.json').then((response) => response.json());
		defaultProductList.forEach((productData: any) => {
			//	@ts-ignore
			const product = new Product({
				...productData,
				isParsing: true,
				_rating: productData.rating,
				_numberOfReviews: productData.numberOfReviews,
				_numberOfSales: productData.numberOfSales,
				_numberOfOngoingOrders: productData.numberOfOngoingOrders,
			});
			this.addItem(product);
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
			const user = new Product({
				_id: data._id,
				name: data.name,
				description: data.description,
				model: data.model,
				price: data.price,
				quantity: data.quantity,
				weight: data.weight,
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
			return user;
		} catch (error) {
			console.error(`Error parsing user data: ${error}`);
			return null;
		}
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
