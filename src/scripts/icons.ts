//	Package Imports
import {
	ChevronLeft,
	ClipboardList,
	KeyRound,
	LogOut,
	Mail,
	MapPin,
	Minus,
	MoveLeft,
	MoveRight,
	Palette,
	Phone,
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
			MoveLeft,
			MoveRight,
			Palette,
			Phone,
			Plus,
			ShoppingCart,
			Search,
			User,
			Wallet,
		},
	});

//	Convert all icons on page load
document.addEventListener('DOMContentLoaded', convertIcons);
