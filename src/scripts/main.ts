//	Package Imports
import '@preline/accordion';
import '@preline/tooltip';
import { createIcons, Plus } from 'lucide';

//	Component Imports
import '@/components/Button/logic';
import '@/components/DroneViewer/logic';

//	Convert all <i> tags with the class "lucide" to lucide icons
createIcons({
	icons: {
		Plus,
	},
});
