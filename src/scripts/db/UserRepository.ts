//	Package Imports
import Cookies from 'js-cookie';
import jsSHA from 'jssha';

//	Repository Imports
import { BaseRepository } from '@/scripts/db/BaseRepository';

//	Type Imports
import { CreateUser, LoginUser, RegisterUser, User } from '@/scripts/models/User';

export type UserDictionary = Record<number, User>;
export class UserRepository extends BaseRepository<User> {
	protected readonly storageKey: string = 'users';
	protected readonly repositoryName: string = 'UserRepository';

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
		if (this.getUser(user.id)) throw new Error(`User with id ${user.id} already exists`);
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

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	parse = (data: Record<string, any>): User | null => {
		try {
			const user = new User({
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
			return user;
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

		//	Return the user if found, otherwise return null
		return user!;
	};

	private loginUserById = (id: number): User => {
		const user = this.getUser(id);

		//	If the user is not found, throw an error
		if (!user) throw new Error(`No account exists with the id ${id}`);

		//	Save the user id in cookies if found
		Cookies.set('user', id.toString(), { expires: 7 });

		//	Return the user if found, otherwise return null
		return user;
	};

	loginFromCookies = (): User | null => {
		const userId = Cookies.get('user');
		if (userId) {
			try {
				const user = this.loginUserById(Number(userId));
				window.currentUser = user;
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

		//	Create a new user and add it to the local storage
		const newUser = new User(formattedData);
		this.addUser(newUser);

		//	Save the user id in cookies
		Cookies.set('user', newUser.id.toString(), { expires: 7 });

		//	Return the new user
		return newUser;
	};

	logoutUser = (): void => {
		Cookies.remove('user');
		window.currentUser = null;
		window.location.reload();
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
