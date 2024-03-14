//	Package Imports
import jsSHA from 'jssha';

export interface IUser {
	/**
	 * The user's unique identifier, if the user is an admin, this will be 0
	 */
	id: number;

	/**
	 * The user's name as an object containing the first and last name
	 */
	name: {
		/**
		 * The user's first name, if the user is an admin, this will be "Admin"
		 */
		first: string;

		/**
		 * The user's last name, empty if the user is an admin
		 */
		last?: string;
	};

	/**
	 * The user's email address
	 */
	email: string;

	/**
	 * The user's phone number with Qatar's country code and in the format +974-XXXX-XXXX
	 */
	phone: string;

	/**
	 * The user's password
	 */
	password: string;
}

export interface User extends IUser {}
export interface CreateUser extends Pick<User, 'name' | 'email' | 'phone' | 'password'> {}

export class User {
	protected static count: number = 0;
	private _id: number;

	constructor(userData: CreateUser) {
		this.name = userData.name;
		this.email = userData.email;
		this.phone = userData.phone;

		//	Hasing the password using SHA-256
		const hashObject = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
		hashObject.update(userData.password);
		this.password = hashObject.getHash('HEX');

		//	Set the user's unique identifier
		this._id = ++User.count;
	}

	get id(): number {
		return this._id;
	}

	getName = (): string => this.name.first + (this.name.last ? ` ${this.name.last}` : '');
	getFirstName = (): string => this.name.first;
	getLastName = (): string => this.name.last || '';
}
