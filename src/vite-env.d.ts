/// <reference types="vite/client" />

//	Model Imports
import { User } from '@/scripts/models/User';

//	Repository Imports
import { UserRepository } from '@/scripts/db/UserRepository';

//	Extend the window object to include the current user
declare global {
	interface Window {
		/**
		 * The currently logged in user
		 */
		currentUser: User | null;

		/**
		 * The user repository
		 */
		UserRepository: UserRepository;
	}

	interface Document {
		startViewTransition(callback: () => void): void;
	}
}
