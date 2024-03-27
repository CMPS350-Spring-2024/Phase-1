//	Package Imports
import * as v from 'valibot';

//	Model Imports
import { BaseModel, CreateBase } from '@/scripts/models/BaseModel';

export interface Transaction extends ITransaction {}
export interface ITransaction {
	/**
	 * The amount of money involved in the transaction
	 */
	amount: number;

	/**
	 * The date and time the transaction was made
	 */
	dateTime: number;

	/**
	 * The user that made the transaction
	 */
	userId: number;

	/**
	 * Is the transaction a deposit or a withdrawal
	 */
	type: 'deposit' | 'withdrawal';
}

export class Transaction extends BaseModel {
	protected static readonly repositoryKey: string = 'TransactionRepository';

	constructor(transactionData: CreateTransaction) {
		super(transactionData);

		this.amount = transactionData.amount;
		this.type = transactionData.type;

		//	If we are only parsing the transaction data, keep it as is
		if (transactionData.isParsing) {
			this.dateTime = transactionData._dateTime || Date.now();
			this.userId = transactionData._userId || (window.currentUser || { id: 0 }).id;
		} else {
			this.dateTime = Date.now();
			this.userId = (window.currentUser || { id: 0 }).id;
		}
	}
}

export interface CreateTransaction extends CreateBase, Pick<Transaction, 'amount' | 'type'> {
	/**
	 * Only used when parsing the transaction data
	 */
	_dateTime?: number;
	_userId?: number;
}
export const CreateTransactionSchema = v.object({
	amount: v.number([v.minValue(0)]),
	type: v.picklist(['deposit', 'withdrawal']),
});
