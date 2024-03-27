//	Repository Imports
import { ProductRepository } from '@/scripts/db/ProductRepository';
import { TransactionRepository } from '@/scripts/db/TransactionRepository';
import { UserRepository } from '@/scripts/db/UserRepository';

//	Initialize all repositories
Promise.all([new ProductRepository().initialize(), new TransactionRepository().initialize(), new UserRepository().initialize()]);
