//	Data Imports

//	Type Imports
import { BaseModel } from '@/scripts/models/BaseModel';

export type BaseRepositoryEvents = 'initialize' | 'add' | 'update' | 'dataChange';
export type BaseDictionary<Model extends BaseModel> = Record<number, Model>;
export abstract class BaseRepository<Model extends BaseModel> {
	protected abstract readonly storageKey: string;
	protected abstract readonly repositoryKey: string;
	protected numberOfItems: number = 0;
	protected items: BaseDictionary<Model> = {};

	protected onInitialize: Array<Function> = [];
	protected onAdd: Array<Function> = [];
	protected onUpdate: Array<Function> = [];

	private _isInitialized: boolean = false;

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

	protected validateAddItem(item: Model): void {
		if (this.getItem(item.id)) throw new Error(`Item with id ${item.id} already exists in ${this.storageKey}`);
	}
	protected addItem = (item: Model): void => {
		this.validateAddItem(item);

		//	Add the item to the local storage and update the number of items
		this.items[item.id] = item;
		window.localStorage.setItem(this.storageKey, JSON.stringify(this.items));
		this.numberOfItems = Object.keys(this.items).length;

		//	Call all onAdd functions
		this.onAdd.forEach((func) => func(item));
	};

	abstract addDefaultData(): Promise<void>;

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Update
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Update                             */
	/* -------------------------------------------------------------------------- */

	protected updateItemsList() {
		this.items = this.getAllItems();
		this.updateNumberOfItems();
	}

	protected updateNumberOfItems = (): void => {
		this.numberOfItems = Object.keys(this.items).length;
	};

	protected validateUpdateItem(item: Model): void {
		if (!this.getItem(item.id)) throw new Error(`Item with id ${item.id} does not exist in ${this.storageKey}`);
	}
	protected updateItem = (item: Model): void => {
		this.validateUpdateItem(item);

		//	Update the item in local storage
		this.items[item.id] = item;
		window.localStorage.setItem(this.storageKey, JSON.stringify(this.items));

		//	Call all onUpdate functions
		this.onUpdate.forEach((func) => func(item));
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	listen(event: BaseRepositoryEvents, func: Function): void {
		if (event === 'initialize') {
			this.onInitialize.push(func);
			if (this._isInitialized) func();
		}

		if (event === 'add') this.onAdd.push(func);
		if (event === 'update') this.onUpdate.push(func);
		if (event === 'dataChange') {
			this.onAdd.push(func);
			this.onUpdate.push(func);
		}
	}

	initialize = async () => {
		//	Add this object to the window object for global access
		//	@ts-ignore
		window[this.repositoryKey] = this;

		//	Subscribe to the storage event to update the items list
		window.addEventListener('storage', this.updateItemsList);

		//	Initialize the items in local storage
		this.updateItemsList();
		await this.addDefaultData();

		//	Call all onInitialize functions
		this.onInitialize.forEach((func) => func());
		this._isInitialized = true;
	};

	/**
	 * Uses the given data to create a new item
	 */
	abstract parse(data: Record<string, any>): Model | null;

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
