/// <reference types="vite/client" />

//	Model Imports
import { User } from '@/scripts/models/User';

//	Extend the window object to include the current user
declare global {
	interface Window {
		/**
		 * The currently logged in user
		 */
		currentUser: User | null;
	}
}
