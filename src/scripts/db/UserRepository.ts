//	Type Imports
import { User } from '../../models/User';

export class UserRepository {
	private static numberOfUsers: number = 0;

	static getUsers(): Array<User> {
		const currentUsers = window.localStorage.getItem('users') || '[]';
		return JSON.parse(currentUsers) as Array<User>;
	}

	static addUser(user: User): void {
		//	Add the user to the local storage
		const users = UserRepository.getUsers();
		users.push(user);
		window.localStorage.setItem('users', JSON.stringify(users));

		//	Increment the number of users
		UserRepository.numberOfUsers++;
	}

	static updateNumberOfUsers() {
		const users = UserRepository.getUsers();
		UserRepository.numberOfUsers = users.length;
	}

	static getNumberOfUsers(): number {
		return UserRepository.numberOfUsers;
	}
}

//	Set the number of users to the number of users in the local storage
UserRepository.updateNumberOfUsers();

const person = new User({
	name: { first: 'John', last: 'Doe' },
	email: 'johndoe@gmail.com',
	phone: '+974-1234-5678',
	password: 'password',
});
UserRepository.addUser(person);
console.log(UserRepository.getNumberOfUsers());
