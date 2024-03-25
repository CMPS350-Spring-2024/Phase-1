//	Data Imports
import DefaultProductList from '@/scripts/data/product_list.json';

//	Repository Imports
import { BaseRepository } from '@/scripts/db/BaseRepository';

//	Type Imports
import { Product } from '@/scripts/models/Product';

export type ProductDictionary = Record<number, Product>;
export class ProductRepository extends BaseRepository<Product> {
	protected readonly storageKey: string = 'products';

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

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Add
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Add                               */
	/* -------------------------------------------------------------------------- */

	addProduct = (product: Product): void => this.addItem(product);
	addDefaultData = (): void => {
		if (this.getNumberOfProducts() > 0) return;
		DefaultProductList.forEach((productData) => {
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
