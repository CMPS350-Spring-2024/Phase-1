//	Package Imports
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface DroneViewerProps extends BaseComponentProps {}

/**
 * Custom drone viewer which displays the 3D model of the current selected drone.
 */
export class DroneViewer extends PrimitiveComponent {
	protected static readonly templateName: string = 'drone-viewer-template';
	protected static readonly forwardedAttributes: Array<keyof DroneViewerProps> = ['class'];
	protected static readonly defaultProperties: DroneViewerProps = {};

	constructor() {
		super({
			elementName: 'canvas',
			defaultProperties: DroneViewer.defaultProperties,
		});

		//	Create and setup a new scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(-1.8, 0.9, 2.7);

		//	Create and setup a new renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.element as HTMLCanvasElement });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);

		//	Add a light to the scene
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight.position.set(1, 1, 2);
		scene.add(ambientLight);
		scene.add(directionalLight);

		//	Setup the orbit controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', () => renderer.render(scene, camera));
		controls.minDistance = 0.5;
		controls.maxDistance = 5;
		controls.target.set(0, 0, -0.2);
		controls.update();

		//	Append the renderer to this component
		this.shadowRoot!.appendChild(renderer.domElement);

		//	Load the drone model
		const loader = new GLTFLoader();
		loader.load(
			'/models/Mavic 3.glb',
			async (gltf) => {
				const model = gltf.scene;
				model.scale.set(5, 5, 5);
				await renderer.compileAsync(model, camera, scene);
				scene.add(model);
				renderer.render(scene, camera);
			},
			undefined,
			(error) => {
				console.error(error);
			},
		);
	}
}

customElements.define('ui-drone-viewer', DroneViewer);
