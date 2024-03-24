//	Package Imports
import {
	ArrowDownUp,
	CheckCircle,
	ChevronLeft,
	ClipboardList,
	Clock3,
	Coins,
	Delete,
	ListFilter,
	LogOut,
	MapPin,
	Minus,
	MousePointerClick,
	MoveRight,
	PackageCheck,
	Palette,
	Plus,
	PlusCircle,
	Search,
	ShoppingCart,
	Star,
	TrendingDown,
	TrendingUp,
	User,
	Users,
	Wallet,
	createIcons,
} from 'lucide';

//	Convert all <i> tags with the class "lucide" to lucide icons
export const convertIcons = () =>
	createIcons({
		icons: {
			ChevronLeft,
			ClipboardList,
			Coins,
			LogOut,
			MapPin,
			Minus,
			MoveRight,
			Palette,
			Plus,
			Search,
			User,
			ShoppingCart,
			Users,
			Wallet,
			TrendingUp,
			TrendingDown,
			MousePointerClick,
			PackageCheck,
			CheckCircle,
			Clock3,
			Star,
			Delete,
			ArrowDownUp,
			ListFilter,
			PlusCircle,
		},
	});

//	Convert all icons on page load
document.addEventListener('DOMContentLoaded', convertIcons);
