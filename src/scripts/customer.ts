//	If the user is not logged in or is not an customer, redirect to the login page
if (!window.currentUser || window.currentUser.isAdmin) window.location.assign('/login.html');
