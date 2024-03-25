//	Repository Imports
import { UserRepository } from '@/scripts/db/UserRepository';

//	Initialize all repositories
new UserRepository().initialize();

//	Get the current user from the cookies and store it in the window object
window.UserRepository.loginFromCookies();
