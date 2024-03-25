//	Data Imports

//	Type Imports
import { BaseModel } from '@/scripts/models/BaseModel';

export type BaseDictionary<Model extends BaseModel> = Record<number, Model>;
export abstract class BaseRepository<Model extends BaseModel> {
	protected abstract storageKey: string;
	protected numberOfItems: number = 0;
	protected items: BaseDictionary<Model> = {};

	//#region Get
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Get                               */
	/* -------------------------------------------------------------------------- */

	protected getAllItems = (): BaseDictionary<Model> => {
		let currentItems: BaseDictionary<Model> = {};
		try {
			//	Transform each object in local storage to the appropriate class object
			currentItems = JSON.parse(window.localStorage.getItem(this.storageKey) || '{}');
			const parsedItems = Object.values(currentItems).reduce((acc: BaseDictionary<Model>, item: any) => {
				const itemObject = this.parse(item);
				if (!itemObject) throw new Error(`Item object is not valid: ${item}`);
				acc[itemObject.id] = itemObject;
				return acc;
			}, {});
			return parsedItems as BaseDictionary<Model>;
		} catch (error) {
			console.error(`Error parsing items from local storage: ${error}`);

			//	Reinitialize the items in local storage
			console.warn('Reinitializing items in local storage, previous data will be lost');
			this.items = {};
			this.initialize();
			return this.items;
		}
	};

	protected getItem = (id: number): Model | null => this.items[id];
	protected getNumberOfItems = (): number => this.numberOfItems;

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Add
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Add                               */
	/* -------------------------------------------------------------------------- */

	protected validateAddItem = (item: Model): void => {
		if (this.getItem(item.id)) throw new Error(`Item with id ${item.id} already exists in ${this.storageKey}`);
	};
	protected addItem = (item: Model): void => {
		this.validateAddItem(item);

		//	Add the item to the local storage and update the number of items
		this.items[item.id] = item;
		window.localStorage.setItem(this.storageKey, JSON.stringify(this.items));
		this.numberOfItems++;
	};

	abstract addDefaultData(): void;

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Update
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Update                             */
	/* -------------------------------------------------------------------------- */

	protected updateItemsList = (): void => {
		this.items = this.getAllItems();
		this.updateNumberOfItems();
	};

	protected updateNumberOfItems = (): void => {
		this.numberOfItems = Object.keys(this.items).length;
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	initialize = (): void => {
		//	Add this object to the window object for global access
		//	@ts-ignore
		window[(this as Object).constructor.name] = this;

		//	Initialize the items in local storage
		this.updateItemsList();
		this.addDefaultData();

		//	Subscribe to the storage event to update the items list
		window.addEventListener('storage', this.updateItemsList);
	};

	/**
	 * Uses the given data to create a new item
	 */
	abstract parse(data: Record<string, any>): Model | null;

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
