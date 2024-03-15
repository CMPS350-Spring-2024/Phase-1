//	Package Imports
import jsSHA from 'jssha';

//	Type Imports
import { LoginUser, User } from '@/scripts/models/User';

export type UserDictionary = Record<number, User>;
export class UserRepository {
	private static numberOfUsers: number = 0;
	private static users: UserDictionary = {};

	//#region Get
	/* -------------------------------------------------------------------------- */
	/*                               // SECTION Get                               */
	/* -------------------------------------------------------------------------- */

	static getUsers = (): UserDictionary => {
		const currentUsers = JSON.parse(window.localStorage.getItem('users') || '{}');

		//	Transform each object in local storage to a User object
		try {
			const parsedUsers = Object.values(currentUsers).reduce((acc: UserDictionary, user: any) => {
				const userObject = User.parse(user);
				if (!userObject) throw new Error(`User object is not valid: ${user}`);
				acc[userObject.id] = userObject;
				return acc;
			}, {});
			return parsedUsers as UserDictionary;
		} catch (error) {
			console.error(`Error parsing users from local storage: ${error}`);
			return {};
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

	static addUser = (user: User): void => {
		if (UserRepository.users[user.id]) throw new Error(`User with id ${user.id} already exists`);
		if (UserRepository.getUserByEmail(user.email)) throw new Error(`User with email ${user.email} already exists`);

		//	Add the user to the local storage
		UserRepository.users[user.id] = user;
		window.localStorage.setItem('users', JSON.stringify(UserRepository.users));

		//	Update the number of users
		UserRepository.numberOfUsers++;
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	//#region Update
	/* -------------------------------------------------------------------------- */
	/*                              // SECTION Update                             */
	/* -------------------------------------------------------------------------- */

	static updateUsersList = (): void => {
		UserRepository.users = UserRepository.getUsers();
		UserRepository.updateNumberOfUsers();
	};

	static updateNumberOfUsers = (): void => {
		UserRepository.numberOfUsers = Object.keys(UserRepository.users).length;
	};

	/* ------------------------------- // !SECTION ------------------------------ */
	//#endregion

	/**
	 * Uses the given user data to log in and find the user in the local storage if it exists.
	 *
	 * **Note: The password should not be hashed when calling this function.**
	 */
	static loginUser = (userData: LoginUser): User | null => {
		//	Transform the user data by hashing the password
		const hashObject = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
		hashObject.update(userData.password);
		userData.password = hashObject.getHash('HEX');

		//	Find user in the local storage with matching email and password
		const user = Object.values(UserRepository.users).find(
			(user) => user.email === userData.email && user.password === userData.password,
		);

		//	Return the user if found, otherwise return null
		return user || null;
	};
}

//	Set the number of users to the number of users in the local storage whenever the local storage is updated
UserRepository.updateUsersList();
window.addEventListener('storage', UserRepository.updateUsersList);

// const person = new User({
// 	name: { first: 'John', last: 'Doe' },
// 	email: 'test@gmail.com',
// 	phone: '+974-1234-5678',
// 	password: 'Test.123',
// });
// UserRepository.addUser(person);
// console.log(person);
