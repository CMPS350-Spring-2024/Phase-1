//	Package Imports
import {
	ChevronLeft,
	ClipboardList,
	LogOut,
	MapPin,
	Minus,
	MoveRight,
	Palette,
	Plus,
	User,
	Wallet,
	createIcons,
} from 'lucide';

//	Convert all <i> tags with the class "lucide" to lucide icons
export const convertIcons = () =>
	createIcons({
		icons: {
			ChevronLeft,
			ClipboardList,
			LogOut,
			MapPin,
			Minus,
			MoveRight,
			Palette,
			Plus,
			User,
			Wallet,
		},
	});

//	Convert all icons on page load
document.addEventListener('DOMContentLoaded', convertIcons);
