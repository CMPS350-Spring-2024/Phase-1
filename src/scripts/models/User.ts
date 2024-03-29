//	Package Imports
import jsSHA from 'jssha';
import * as v from 'valibot';

//	Model Imports
import { Avatar } from '@/components/Avatar/logic';
import { BaseModel } from '@/scripts/models/BaseModel';

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
export const LoginSchema = v.object({
	email: v.string([v.minLength(1, 'Please enter your email'), v.email('Your email must be a valid email address')]),
	password: v.string([
		v.minLength(1, 'Please enter your password'),
		v.minLength(8, 'Your password must be at least 8 characters long'),
		v.regex(
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
export const RegistrationSchema = v.object(
	{
		firstName: v.string([v.minLength(1, 'Please enter your first name')]),
		lastName: v.string([v.minLength(1, 'Please enter your last name')]),
		email: v.string([
			v.minLength(1, 'Please enter your email'),
			v.email('Your email must be a valid email address'),
		]),
		phone: v.string([
			v.minLength(1, 'Please enter your phone number'),
			v.regex(/^\+974 \d{4} \d{4}$/, 'Your phone number must be in the format +974 XXXX XXXX'),
		]),
		password: v.string([
			v.minLength(1, 'Please enter your password'),
			v.minLength(8, 'Your password must be at least 8 characters long'),
			v.regex(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
				'Your password must contain at least one uppercase letter, one lowercase letter, and one number',
			),
		]),
		confirmPassword: v.string([v.minLength(1, 'Please confirm your password')]),
	},
	[v.custom(({ password, confirmPassword }) => password === confirmPassword, 'Your passwords do not match')],
);

export interface CreateUser extends Pick<User, 'name' | 'email' | 'phone' | 'password'> {
	/**
	 * Only used when parsing the user data
	 */
	isParsing?: boolean;
	_id?: number;
	_avatarColor?: AvatarProps['color'];
	_balance?: number;
}
