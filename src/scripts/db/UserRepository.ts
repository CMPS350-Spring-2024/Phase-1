//	Package Imports
import Cookies from 'js-cookie';
import jsSHA from 'jssha';

//	Data Imports
import DefaultAdmin from '@/scripts/data/default_admin.json';

//	Type Imports
import { CreateUser, LoginUser, RegisterUser, User } from '@/scripts/models/User';

export type UserDictionary = Record<number, User>;
export class UserRepository {
	private static numberOfUsers: number = 0;
	private static users: UserDictionary = {};

	//#region Get
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Get                               */
	/* -------------------------------------------------------------------------- */

	static getAllUsers = (): UserDictionary => {
		let currentUsers: UserDictionary = {};
		try {
			//	Transform each object in local storage to a User object
			currentUsers = JSON.parse(window.localStorage.getItem('users') || '{}');
			const parsedUsers = Object.values(currentUsers).reduce((acc: UserDictionary, user: any) => {
				const userObject = User.parse(user);
				if (!userObject) throw new Error(`User object is not valid: ${user}`);
				acc[userObject.id] = userObject;
				return acc;
			}, {});
			return parsedUsers as UserDictionary;
		} catch (error) {
			console.error(`Error parsing users from local storage: ${error}`);

			//	Reinitialize the users in local storage
			console.warn('Reinitializing users in local storage, previous data will be lost');
			UserRepository.users = {};
			UserRepository.initialize();
			return UserRepository.users;
		}
	};

	static getUser = (id: number): User | null => UserRepository.users[id];

	static getUserByEmail = (email: string): User | null => {
		const user = Object.values(UserRepository.users).find((user) => user.email === email);
		return user || null;
	};

	static getNumberOfUsers = (): number => {
		return UserRepository.numberOfUsers;
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Add
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Add                               */
	/* -------------------------------------------------------------------------- */

	private static addUser = (user: User): void => {
		if (UserRepository.users[user.id]) throw new Error(`User with id ${user.id} already exists`);
		if (UserRepository.getUserByEmail(user.email)) throw new Error(`User with email ${user.email} already exists`);

		//	Add the user to the local storage
		UserRepository.users[user.id] = user;
		window.localStorage.setItem('users', JSON.stringify(UserRepository.users));

		//	Update the number of users
		UserRepository.numberOfUsers++;
	};

	static addDefaultAdmin = (): void => {
		//	@ts-ignore
		const admin = new User({
			...DefaultAdmin,
			_id: 0,
			isParsing: true,
		});
		UserRepository.addUser(admin);
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Update
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Update                             */
	/* -------------------------------------------------------------------------- */

	static updateUsersList = (): void => {
		UserRepository.users = UserRepository.getAllUsers();
		UserRepository.updateNumberOfUsers();
	};

	static updateNumberOfUsers = (): void => {
		UserRepository.numberOfUsers = Object.keys(UserRepository.users).length;
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Others
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Others                             */
	/* -------------------------------------------------------------------------- */

	/**
	 * Initializes the user repository by adding the default admin user.
	 */
	static initialize = (): void => {
		if (!UserRepository.getUser(0)) UserRepository.addDefaultAdmin();
	};

	/**
	 * Uses the given user data to log in and find the user in the local storage if it exists.
	 *
	 * **Note: The password should not be hashed when calling this function.**
	 */
	static loginUser = (userData: LoginUser): User => {
		//	Transform the user data by hashing the password
		const hashObject = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
		hashObject.update(userData.password);
		userData.password = hashObject.getHash('HEX');

		//	Find user in the local storage with matching email and password
		let userExists = false;
		const user = Object.values(UserRepository.users).find((user) => {
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

	private static loginUserById = (id: number): User => {
		const user = UserRepository.getUser(id);

		//	If the user is not found, throw an error
		if (!user) throw new Error(`No account exists with the id ${id}`);

		//	Save the user id in cookies if found
		Cookies.set('user', id.toString(), { expires: 7 });

		//	Return the user if found, otherwise return null
		return user;
	};

	static loginFromCookies = (): User | null => {
		const userId = Cookies.get('user');
		if (userId) {
			try {
				const user = UserRepository.loginUserById(Number(userId));
				window.currentUser = user;
				return user;
			} catch (error) {
				Cookies.remove('user');
			}
		}
		return null;
	};

	static registerUser = (userData: RegisterUser): User => {
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
		UserRepository.addUser(newUser);

		//	Save the user id in cookies
		Cookies.set('user', newUser.id.toString(), { expires: 7 });

		//	Return the new user
		return newUser;
	};

	static logoutUser = (): void => {
		Cookies.remove('user');
		window.currentUser = null;
		window.location.reload();
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion
}
