//	Package Imports
import { parse } from 'valibot';

//	Repository Imports
import { BaseRepository } from '@/scripts/db/BaseRepository';

//	Type Imports
import { CreateTransactionSchema, Transaction } from '@/scripts/models/Transaction';

export type TransactionDictionary = Record<number, Transaction>;
export class TransactionRepository extends BaseRepository<Transaction> {
	protected readonly storageKey: string = 'transactions';
	protected readonly repositoryKey: string = 'TransactionRepository';

	private get transactions(): TransactionDictionary {
		return this.getAllTransactions();
	}
	private set transactions(transactions: TransactionDictionary) {
		this.items = transactions;
	}

	//#region Get
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Get                               */
	/* -------------------------------------------------------------------------- */

	getAllTransactions = (): TransactionDictionary => this.getAllItems() as TransactionDictionary;
	getTransaction = (id: number): Transaction | null => this.getItem(id);
	getNumberOfTransactions = (): number => this.getNumberOfItems();

	getTransactionsByUser = (userId: number): Transaction[] => [];
	getTransactionsByType = (type: 'deposit' | 'withdrawal'): Transaction[] => [];
	getTransactionsByDate = (date: number): Transaction[] => [];

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Add
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Add                               */
	/* -------------------------------------------------------------------------- */

	protected validateAddItem = (transaction: Transaction): void => {
		super.validateAddItem(transaction);

		if (!window.currentUser) throw new Error('You must be logged in to add a transaction');
		if (transaction.userId !== window.currentUser.id) throw new Error('Transaction user id does not match current user id');
		if (transaction.amount > window.currentUser.balance) throw new Error('Insufficient funds to make transaction');

		parse(CreateTransactionSchema, transaction);
	};

	addTransaction = (transaction: Transaction): void => this.addItem(transaction);
	addDefaultData = async () => {
		if (this.getNumberOfTransactions() > 0) return;
		const defaultTransactionList = await fetch('/data/default_transactions.json').then((response) => response.json());
		defaultTransactionList.forEach((transactionData: any) => {
			const transaction = new Transaction({
				...transactionData,
				isParsing: true,
				_dateTime: transactionData.dateTime,
				_userId: transactionData.userId,
			});
			this.addTransaction(transaction);
		});
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	parse = (data: Record<string, any>): Transaction | null => {
		try {
			const transaction = new Transaction({
				_id: data._id,
				amount: data.amount,
				type: data.type,

				isParsing: true,
				_dateTime: data.dateTime,
				_userId: data.userId,
			});
			return transaction;
		} catch (error) {
			console.error(`Error parsing transaction data: ${error}`);
			return null;
		}
	};

	/**
	 * Top up the current user's balance by the given amount
	 */
	topUpBalance = (amount: number): void => {
		const transaction = new Transaction({ amount, type: 'deposit' });
		this.addTransaction(transaction);
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
