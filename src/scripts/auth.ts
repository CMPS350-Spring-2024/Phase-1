//	Package Imports
import * as v from 'valibot';

//	Component Imports
import { Alert } from '@/components/Alert/logic';

//	Schema Imports
import { LoginSchema, RegistrationSchema } from '@/scripts/models/User';

//	Utility Imports
import { find } from '@/scripts/_utils';

const alert = find('ui-alert') as Alert;
const loginForm = find('#login_form') as HTMLFormElement;
const registrationForm = find('#registration_form') as HTMLFormElement;

/**
 * Handles the form submission, logs the user in
 */
export const handleLogin = (event: Event) => {
	event.preventDefault();

	//	Extract the form data
	const formData = new FormData(loginForm);
	const data = Object.fromEntries(formData.entries());

	//	Validate the incoming data and show the errors if any, then log the user in
	try {
		const output = v.parse(LoginSchema, data);
		const user = window.UserRepository.loginUser(output);

		//	Redirect to either the customer page or admin page
		if (user.isAdmin) window.location.assign('/admin/index.html');
		else window.location.assign('/customer/index.html');
	} catch (error: unknown) {
		console.error(`Error logging in: ${error}`);
		alert.displayError('There was an error logging in. Please try again.', error);
	}
};

/**
 * Validates the incoming data, shows errors if any, and creates a new user
 * TODO show toast messages for errors and success
 */
export const handleRegistration = (event: Event) => {
	event.preventDefault();

	//	Extract the form data
	const formData = new FormData(registrationForm);
	const data = Object.fromEntries(formData.entries());

	//	Validate the incoming data and show the errors if any, then register the user
	try {
		const output = v.parse(RegistrationSchema, data);
		window.UserRepository.registerUser(output);
		window.location.assign('/customer/index.html');
	} catch (error: unknown) {
		console.error(`Error registering user: ${error}`);
		alert.displayError('There was an error registering the user. Please try again.', error);
	}
};

//	Add event listeners to the forms
if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registrationForm) registrationForm.addEventListener('submit', handleRegistration);
