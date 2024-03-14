//	Package Imports
import {
	ChevronLeft,
	ClipboardList,
	KeyRound,
	LogOut,
	Mail,
	MapPin,
	Minus,
	MoveRight,
	Palette,
	Plus,
	Search,
	ShoppingCart,
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
			KeyRound,
			LogOut,
			Mail,
			MapPin,
			Minus,
			MoveRight,
			Palette,
			Plus,
			ShoppingCart,
			Search,
			User,
			Wallet,
		},
	});

//	Convert all icons on page load
document.addEventListener('DOMContentLoaded', convertIcons);
