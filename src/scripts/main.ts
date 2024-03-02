//	Package Imports
import '@preline/accordion';
import '@preline/dropdown';
import '@preline/tooltip';
import { MoveRight, Plus, createIcons } from 'lucide';

//	Component Imports
import '@/components/Button/logic';
import '@/components/DroneViewer/logic';

//	Convert all <i> tags with the class "lucide" to lucide icons
createIcons({
	icons: {
		MoveRight,
		Plus,
	},
});
