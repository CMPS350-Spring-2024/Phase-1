//	Repository Imports
import { UserRepository } from '@/scripts/db/UserRepository';

//	Set the number of users to the number of users in the local storage whenever the local storage is updated
UserRepository.updateUsersList();
window.addEventListener('storage', UserRepository.updateUsersList);

//	If the default admin is not in the local storage, add it
if (!UserRepository.getUser(0)) UserRepository.addDefaultAdmin();

//	Get the current user from the cookies and store it in the window object
UserRepository.loginFromCookies();
