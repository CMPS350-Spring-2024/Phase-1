export interface User {
	/**
	 * The user's unique identifier, if the user is an admin, this will be 0
	 */
	// id: number;

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

export interface CreateUser extends Pick<User, 'name' | 'email' | 'phone' | 'password'> {}

export class User {
	protected static count: number = 0;

	constructor(userData: CreateUser) {
		Object.assign(this, userData);

		// Set the user's unique identifier
		this.id = ++User.count;
	}

	/**
	 * The user's unique identifier, if the user is an admin, this will be 0
	 */
	get id(): number {
		return this.id;
	}
	private set id(value: number) {
		this.id = value;
	}

	getName = (): string => this.name.first + (this.name.last ? ` ${this.name.last}` : '');
	getFirstName = (): string => this.name.first;
	getLastName = (): string => this.name.last || '';
}

const person = new User({
	name: { first: 'John', last: 'Doe' },
	email: 'johndoe@gmail.com',
	phone: '+974-1234-5678',
	password: 'password',
});

console.log(person);
