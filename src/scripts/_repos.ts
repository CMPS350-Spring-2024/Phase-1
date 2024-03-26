//	Repository Imports
import { ProductRepository } from '@/scripts/db/ProductRepository';
import { UserRepository } from '@/scripts/db/UserRepository';

//	Initialize all repositories
Promise.all([new ProductRepository().initialize(), new UserRepository().initialize()]);
