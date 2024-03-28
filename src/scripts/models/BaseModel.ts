export abstract class BaseModel {
	protected static readonly repositoryKey: string;
	protected _id: number;

	get id(): number {
		return this._id;
	}

	constructor(data: CreateBase) {
		//	Generate a random id which is not already in use
		let newId = 0;
		//	@ts-ignore
		while (newId === 0 || window[((this as Object).constructor as any).repositoryKey].getItem(newId))
			newId = crypto.getRandomValues(new Uint32Array(1))[0];

		//	Assign the id based on the data
		if (data.isParsing) this._id = data._id ?? newId;
		else this._id = newId;
	}
}

export interface CreateBase {
	/**
	 * Only used when parsing the user data
	 */
	isParsing?: boolean;
	_id?: number;
}
