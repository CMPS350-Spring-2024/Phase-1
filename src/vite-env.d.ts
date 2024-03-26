/// <reference types="vite/client" />

//	Model Imports
import { User } from '@/scripts/models/User';

//	Repository Imports
import { ProductRepository } from '@/scripts/db/ProductRepository';
import { UserRepository } from '@/scripts/db/UserRepository';

//	Extend the window object to include the current user
declare global {
	interface Window {
		/**
		 * The currently logged in user
		 */
		currentUser: User | null;

		/**
		 * The product repository
		 */
		ProductRepository: ProductRepository;

		/**
		 * The user repository
		 */
		UserRepository: UserRepository;
	}

	interface Document {
		startViewTransition(callback: () => void): void;
	}
}
