//	Package Imports
import '@preline/accordion';
import '@preline/tooltip';
import { ClipboardList, LogOut, MapPin, MoveRight, Palette, Plus, User, Wallet, createIcons } from 'lucide';

//	Component Imports
import '@/components/Button/logic';
import '@/components/DroneViewer/logic';
import '@/components/Dropdown/logic';

//	Convert all <i> tags with the class "lucide" to lucide icons
createIcons({
	icons: {
		ClipboardList,
		LogOut,
		MapPin,
		MoveRight,
		Palette,
		Plus,
		User,
		Wallet,
	},
});
