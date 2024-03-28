/// <reference types="vite/client" />

//	Model Imports
import { Customer } from '@/scripts/models/Customer';
import { User } from '@/scripts/models/User';

//	Repository Imports
import { OrderRepository } from '@/scripts/db/OrderRepository';
import { ProductRepository } from '@/scripts/db/ProductRepository';
import { TransactionRepository } from '@/scripts/db/TransactionRepository';
import { UserRepository } from '@/scripts/db/UserRepository';

//	Extend the window object to include the current user
declare global {
	interface Window {
		/**
		 * The currently logged in user
		 */
		currentUser: User | Customer | null;

		/**
		 * The order repository
		 */
		OrderRepository: OrderRepository;

		/**
		 * The product repository
		 */
		ProductRepository: ProductRepository;

		/**
		 * The transaction repository
		 */
		TransactionRepository: TransactionRepository;

		/**
		 * The user repository
		 */
		UserRepository: UserRepository;
	}

	interface Document {
		startViewTransition(callback: () => void): void;
	}
}

declare module 'three' {
	interface Object3D {
		getObjectByUserDataProperty: (key: string, value: any) => THREE.Object3D | undefined;
		getObjectsByUserDataProperty: (key: string, value: any) => Array<THREE.Object3D>;
	}
}
