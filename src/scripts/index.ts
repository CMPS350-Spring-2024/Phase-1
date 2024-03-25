//	Repository Imports
import { ProductRepository } from '@/scripts/db/ProductRepository';
import { UserRepository } from '@/scripts/db/UserRepository';

//	Initialize all repositories
new ProductRepository().initialize();
new UserRepository().initialize();

//	Get the current user from the cookies and store it in the window object
window.UserRepository.loginFromCookies();
