//	Package Imports
import Cookies from 'js-cookie';
import * as v from 'valibot';

//	Repository Imports
import { UserRepository } from '@/scripts/db/UserRepository';

//	Schema Imports
import { LoginSchema } from '@/scripts/models/User';

let loginForm: HTMLFormElement;

//	When the DOM is ready add event listeners
document.addEventListener('DOMContentLoaded', () => {
	loginForm = document.querySelector('#login_form') as HTMLFormElement;
	loginForm.addEventListener('submit', handleLogin);
});

/**
 * Handles the form submission, logs the user in
 */
export const handleLogin = (event: Event) => {
	event.preventDefault();

	//	Extract the form data
	const formData = new FormData(loginForm);
	const data = Object.fromEntries(formData.entries());

	//	Validate the incoming data and show the errors if any
	const { issues, output, success } = v.safeParse(LoginSchema, data);
	if (!success) {
		console.error(issues);
	}

	//	If the data is valid, try to log the user in
	else {
		const user = UserRepository.loginUser(output);

		//	If the user is not found, show an error
		if (!user) {
			console.error('User not found');
		}

		//	Else, save the user id in cookies and redirect to the customer page
		else {
			Cookies.set('user', user.id.toString(), { expires: 7 });
			window.location.assign('/customer/index.html');
		}
	}
};
