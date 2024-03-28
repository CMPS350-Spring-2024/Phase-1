//	Package Imports
import jsSHA from 'jssha';
import { custom, email, minLength, object, regex, string } from 'valibot';

//	Model Imports
import { Avatar } from '@/components/Avatar/logic';
import { BaseModel, CreateBase } from '@/scripts/models/BaseModel';

//	Type Imports
import type { AvatarProps } from '@/components/Avatar/logic';

export interface User extends IUser {}
export interface IUser {
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

	/**
	 * The color to use for the avatar
	 */
	avatarColor: AvatarProps['color'];

	/**
	 * Amount of money the user has
	 */
	balance: number;
}

export class User extends BaseModel {
	protected static readonly repositoryKey: string = 'UserRepository';

	constructor(userData: CreateUser) {
		super(userData);

		this.name = userData.name;
		this.email = userData.email;
		this.phone = userData.phone;

		//	If we are only parsing the user data, keep it as is
		if (userData.isParsing) {
			this.password = userData.password;
			this.avatarColor = userData._avatarColor || 'black';
			this.balance = userData._balance || 0;
		} else {
			this.avatarColor = Avatar.getRandomizedColor();
			this.balance = 0;

			//	Hasing the password using SHA-256
			const hashObject = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
			hashObject.update(userData.password);
			this.password = hashObject.getHash('HEX');
		}
	}

	get isAdmin(): boolean {
		return this.id === 0;
	}

	getName = (): string => this.name.first + (this.name.last ? ` ${this.name.last}` : '');
	getFirstName = (): string => this.name.first;
	getLastName = (): string => this.name.last || '';
	getAcronym = (): string => this.name.first[0] + (this.name.last ? this.name.last[0] : '');
}

export interface LoginUser extends Pick<User, 'email' | 'password'> {}
export const LoginSchema = object({
	email: string([minLength(1, 'Please enter your email'), email('Your email must be a valid email address')]),
	password: string([
		minLength(1, 'Please enter your password'),
		minLength(8, 'Your password must be at least 8 characters long'),
		regex(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
			'Your password must contain at least one uppercase letter, one lowercase letter, and one number',
		),
	]),
});

export interface RegisterUser extends Pick<User, 'email' | 'phone' | 'password'> {
	firstName: string;
	lastName: string;
	confirmPassword: string;
}
export const RegistrationSchema = object(
	{
		firstName: string([minLength(1, 'Please enter your first name')]),
		lastName: string([minLength(1, 'Please enter your last name')]),
		email: string([minLength(1, 'Please enter your email'), email('Your email must be a valid email address')]),
		phone: string([
			minLength(1, 'Please enter your phone number'),
			regex(/^\+974 \d{4} \d{4}$/, 'Your phone number must be in the format +974 XXXX XXXX'),
		]),
		password: string([
			minLength(1, 'Please enter your password'),
			minLength(8, 'Your password must be at least 8 characters long'),
			regex(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
				'Your password must contain at least one uppercase letter, one lowercase letter, and one number',
			),
		]),
		confirmPassword: string([minLength(1, 'Please confirm your password')]),
	},
	[custom(({ password, confirmPassword }) => password === confirmPassword, 'Your passwords do not match')],
);

export interface CreateUser extends CreateBase, Pick<User, 'name' | 'email' | 'phone' | 'password'> {
	/**
	 * Only used when parsing the product data
	 */
	_avatarColor?: AvatarProps['color'];
	_balance?: number;
}
