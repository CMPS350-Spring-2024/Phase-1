//	Repository Imports
import { ProductRepository } from '@/scripts/db/ProductRepository';
import { UserRepository } from '@/scripts/db/UserRepository';

//	Initialize all repositories
new ProductRepository().initialize();
new UserRepository().initialize();
