//	Package Imports
import jsSHA from 'jssha';

//	Type Imports
import { LoginUser, User } from '@/scripts/models/User';

export type UserDictionary = Record<number, User>;
export class UserRepository {
	private static numberOfUsers: number = 0;

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

	/**
	 * Uses the given user data to log in and find the user in the local storage if it exists.
	 *
	 * NOTE: The password should not be hashed when calling this function.
	 */
	static loginUser = (userData: LoginUser): User | null => {
		const users = UserRepository.getUsers();

		//	Transform the user data by hashing the password
		const hashObject = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
		hashObject.update(userData.password);
		userData.password = hashObject.getHash('HEX');

		//	Find user in the local storage with matching email and password
		const user = Object.values(users).find(
			(user) => user.email === userData.email && user.password === userData.password,
		);

		//	Return the user if found, otherwise return null
		return user || null;
	};

	static addUser = (user: User): void => {
		const users = UserRepository.getUsers();
		if (users[user.id]) throw new Error(`User with id ${user.id} already exists`);
		//	TODO check if the user with the same email already exists
		//	TODO add function to get user by email

		//	Add the user to the local storage
		users[user.id] = user;
		window.localStorage.setItem('users', JSON.stringify(users));

		//	Increment the number of users
		UserRepository.numberOfUsers++;
	};

	static updateNumberOfUsers = (): void => {
		const users = UserRepository.getUsers();
		UserRepository.numberOfUsers = Object.keys(users).length;
	};

	static getNumberOfUsers = (): number => {
		return UserRepository.numberOfUsers;
	};
}

//	Set the number of users to the number of users in the local storage
UserRepository.updateNumberOfUsers();

// const person = new User({
// 	name: { first: 'John', last: 'Doe' },
// 	email: 'test@gmail.com',
// 	phone: '+974-1234-5678',
// 	password: 'Test.123',
// });
// UserRepository.addUser(person);
// console.log(person);
