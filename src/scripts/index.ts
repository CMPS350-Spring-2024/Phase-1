//	Package Imports
import Cookies from 'js-cookie';
import './icons';

//	Component Imports
import '@/components/Avatar/logic';
import '@/components/Button/logic';
import '@/components/Dropdown/logic';
import '@/components/Modal/logic';
import '@/components/Navbar/logic';
import '@/components/NumericInput/logic';
import '@/components/PriceDisplay/logic';
import '@/components/TextInput/logic';

//	Repository Imports
import { UserRepository } from '@/scripts/db/UserRepository';

//	Get the current user from the cookies and store it in the window object
const userId = Cookies.get('user');
if (userId) {
	try {
		const user = UserRepository.loginUserById(Number(userId));
		window.currentUser = user;
	} catch (error) {
		Cookies.remove('user');
	}
}
