//	Package Imports
import {
	ChevronLeft,
	ChevronRight,
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
			ChevronRight,
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
convertIcons();
