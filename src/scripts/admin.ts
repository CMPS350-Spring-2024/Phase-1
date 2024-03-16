//	If the user is not logged in or is not an admin, redirect to the login page
if (import.meta.env.PROD && (!window.currentUser || window.currentUser.id !== 0)) window.location.assign('/login.html');
