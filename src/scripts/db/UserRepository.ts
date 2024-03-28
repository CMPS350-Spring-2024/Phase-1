//	Package Imports
import Cookies from 'js-cookie';
import jsSHA from 'jssha';

//	Repository Imports
import { BaseRepository, BaseRepositoryEvents } from '@/scripts/db/BaseRepository';

//	Type Imports
import { Customer } from '@/scripts/models/Customer';
import { CreateUser, LoginUser, RegisterUser, User } from '@/scripts/models/User';

export type UserRepositoryEvents = 'login' | 'register' | 'logout' | 'authChange' | BaseRepositoryEvents;
export type UserDictionary = Record<number, User>;
export class UserRepository extends BaseRepository<User> {
	protected readonly storageKey: string = 'users';
	protected readonly repositoryKey: string = 'UserRepository';

	protected onLogin: Array<Function> = [];
	protected onRegister: Array<Function> = [];
	protected onLogout: Array<Function> = [];

	private get users(): UserDictionary {
		return this.getAllUsers();
	}
	private set users(users: UserDictionary) {
		this.items = users;
	}

	//#region Get
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Get                               */
	/* -------------------------------------------------------------------------- */

	getAllUsers = (): UserDictionary => this.getAllItems() as UserDictionary;
	getUser = (id: number): User | null => this.getItem(id);
	getNumberOfUsers = (): number => this.getNumberOfItems();

	getUserByEmail = (email: string): User | null => {
		const user = Object.values(this.users).find((user) => user.email === email);
		return user || null;
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Add
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Add                               */
	/* -------------------------------------------------------------------------- */

	protected validateAddItem = (user: User): void => {
		super.validateAddItem(user);

		if (this.getUserByEmail(user.email)) throw new Error(`User with email ${user.email} already exists`);
	};

	addUser = (user: User): void => this.addItem(user);
	addDefaultData = async () => {
		if (this.getUser(0)) return;
		const defaultAdmin = await fetch('/data/default_admin.json').then((response) => response.json());
		//	@ts-ignore
		const admin = new User({
			...defaultAdmin,
			_id: 0,
			isParsing: true,
		});
		this.addItem(admin);
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Update
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Update                             */
	/* -------------------------------------------------------------------------- */

	updateUser = (user: User): void => this.updateItem(user);

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	listen = (event: UserRepositoryEvents, func: Function) => {
		super.listen(event as BaseRepositoryEvents, func);

		if (event === 'login') this.onLogin.push(func);
		if (event === 'register') this.onRegister.push(func);
		if (event === 'logout') this.onLogout.push(func);
		if (event === 'authChange') {
			this.onLogin.push(func);
			this.onRegister.push(func);
			this.onLogout.push(func);
		}
	};

	parse = (data: Record<string, any>): User | null => {
		try {
			//	If the user has an id of 0, it is the admin user
			if (data._id === 0)
				return new User({
					name: {
						first: data.name.first,
						last: data.name.last,
					},
					email: data.email,
					phone: data.phone,
					password: data.password,

					isParsing: true,
					_id: data._id,
					_avatarColor: data.avatarColor,
					_balance: data.balance,
				});

			//	Else, create a new customer object
			return new Customer({
				name: {
					first: data.name.first,
					last: data.name.last,
				},
				email: data.email,
				phone: data.phone,
				password: data.password,
				shippingAddress: data.shippingAddress,

				isParsing: true,
				_id: data._id,
				_avatarColor: data.avatarColor,
				_balance: data.balance,
			});
		} catch (error) {
			console.error(`Error parsing user data: ${error}`);
			return null;
		}
	};

	/**
	 * Uses the given user data to log in and find the user in the local storage if it exists.
	 *
	 * **Note: The password should not be hashed when calling this function.**
	 */
	loginUser = (userData: LoginUser): User => {
		//	Transform the user data by hashing the password
		const hashObject = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
		hashObject.update(userData.password);
		userData.password = hashObject.getHash('HEX');

		//	Find user in the local storage with matching email and password
		let userExists = false;
		const user = Object.values(this.users).find((user) => {
			const userFound = user.email === userData.email;
			const correctPassword = user.password === userData.password;
			if (!userExists && userFound) userExists = true;
			if (userFound && correctPassword) return true;
			return false;
		});

		//	If the user is not found, throw an error
		if (!userExists) throw new Error(`No account exists with the email ${userData.email}`);
		if (userExists && user === undefined) throw new Error('Your password is incorrect. Please try again.');

		//	Save the user id in cookies if found
		Cookies.set('user', user!.id.toString(), { expires: 7 });

		//	Call the login event listeners
		this.onLogin.forEach((func) => func(user!));

		//	Return the user if found, otherwise return null
		return user!;
	};

	private loginUserById = (id: number): User => {
		const user = this.getUser(id);

		//	If the user is not found, throw an error
		if (!user) throw new Error(`No account exists with the id ${id}`);

		//	Save the user id in cookies if found
		Cookies.set('user', id.toString(), { expires: 7 });

		//	Call the login event listeners
		this.onLogin.forEach((func) => func(user!));

		//	Return the user if found, otherwise return null
		return user;
	};

	loginFromCookies = (): User | null => {
		const userId = Cookies.get('user');
		if (userId) {
			try {
				const user = this.loginUserById(Number(userId));
				window.currentUser = user;

				//	Call the login event listeners
				this.onLogin.forEach((func) => func(user!));

				return user;
			} catch (error) {
				Cookies.remove('user');
			}
		}
		return null;
	};

	registerUser = (userData: RegisterUser): User => {
		//	Format the user data
		const formattedData: CreateUser = {
			name: {
				first: userData.firstName,
				last: userData.lastName,
			},
			email: userData.email,
			phone: userData.phone,
			password: userData.password,
		};

		//	Since only customers can create accounts, create a new instance and add it to the local storage
		const newUser = new Customer(formattedData);
		this.addUser(newUser);

		//	Save the user id in cookies
		Cookies.set('user', newUser.id.toString(), { expires: 7 });

		//	Call the register event listeners
		this.onRegister.forEach((func) => func(newUser));

		//	Return the new user
		return newUser;
	};

	logoutUser = (): void => {
		Cookies.remove('user');
		window.currentUser = null;

		//	Call the logout event listeners
		this.onLogout.forEach((func) => func());

		//	Reload the page to update the navbar and make sure the user is logged out
		window.location.reload();
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
