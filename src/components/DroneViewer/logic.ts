//	Package Imports
import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//	Component Imports
import { PrimitiveComponent } from '@/components/PrimitiveComponent';

//	Type Imports
import type { BaseComponentProps } from '@/components/BaseComponent';

export interface DroneViewer extends DroneViewerProps {}
export interface DroneViewerProps extends BaseComponentProps {}

/**
 * Custom drone viewer which displays the 3D model of the current selected drone.
 */
export class DroneViewer extends PrimitiveComponent {
	protected static readonly templateName: string = 'drone-viewer-template';
	protected static readonly forwardedAttributes: Array<keyof DroneViewerProps> = ['class'];
	protected static readonly defaultProperties: DroneViewerProps = {};

	static MODEL_SCALE = 7.5;
	static PLANE_WIDTH = 10;
	static PLANE_HEIGHT = 10;
	static SHADOW_CAMERA_HEIGHT = 0.5;

	static SHADOW_OPACITY = 1;
	static SHADOW_DARKNESS = 1;
	static SHADOW_BLUR = 3;

	container: HTMLElement | null = null;
	helper: HTMLElement | null = null;
	clock: THREE.Clock = new THREE.Clock();
	scene: THREE.Scene = new THREE.Scene();
	camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
	renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
	controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
	renderTarget: THREE.WebGLRenderTarget = new THREE.WebGLRenderTarget(512, 512);
	renderTargetBlur: THREE.WebGLRenderTarget = new THREE.WebGLRenderTarget(512, 512);
	plane: THREE.Mesh = new THREE.Mesh();
	blurPlane: THREE.Mesh = new THREE.Mesh();
	shadowCamera: THREE.OrthographicCamera = new THREE.OrthographicCamera();
	depthMaterial: THREE.MeshDepthMaterial = new THREE.MeshDepthMaterial();
	horizontalBlurMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial();
	verticalBlurMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial();

	constructor() {
		super({
			elementName: 'canvas',
			defaultProperties: DroneViewer.defaultProperties,
		});

		//	Find the container element
		this.container = this.find('[part="container"]') as HTMLElement;
		this.helper = this.find('[part="helper"]') as HTMLElement;

		//	Show the helper based on the session storage
		if (window.sessionStorage.getItem('hideHelper') === 'true') {
			this.helper!.classList.add('opacity-0');
		}

		//	Setup the scene
		this.setupScene();

		//	Load the drone model
		this.loadDrone();

		//	Setup the contact shadow
		this.setupContactShadow();

		//	Start the animation loop
		this.animateFrame();

		//	Handle resize events when the window changes or canvas is resized
		window.addEventListener('resize', () => this.handleWindowResize());
		const resizeObserver = new ResizeObserver(() => this.handleWindowResize());
		resizeObserver.observe(this.element);

		//	Hide helper when the canvas is clicked
		this.element.addEventListener('mousedown', () => this.handleCanvasClick());
		this.element.addEventListener('touchstart', () => this.handleCanvasClick(), { passive: true });
	}

	private handleWindowResize = () => {
		this.camera.aspect = this.container!.clientWidth / this.container!.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.container!.clientWidth, this.container!.clientHeight);
		this.render();
	};

	private handleCanvasClick = () => {
		this.helper!.classList.add('opacity-0');
		window.sessionStorage.setItem('hideHelper', 'true');
	};

	add = (object: THREE.Object3D) => this.scene.add(object);
	render = (shadow: boolean = false) => this.renderer.render(this.scene, shadow ? this.shadowCamera : this.camera);
	updateControls = () => this.controls.update(this.clock.getDelta());

	/**
	 * Initializes the scene by creating a new scene, camera, and renderer.
	 */
	private setupScene = () => {
		//	Create and setup a new scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);
		const camera = new THREE.PerspectiveCamera(
			75,
			(this.element as HTMLCanvasElement).clientWidth / (this.element as HTMLCanvasElement).clientHeight,
			0.1,
			1000,
		);
		camera.position.set(1.5, 0, 2.8);

		//	Create and setup a new renderer
		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: this.element as HTMLCanvasElement,
		});
		renderer.toneMapping = THREE.ReinhardToneMapping;
		renderer.toneMappingExposure = 1.6;
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0xffffff, 0);
		renderer.setSize(
			(this.element as HTMLCanvasElement).clientWidth,
			(this.element as HTMLCanvasElement).clientHeight,
		);

		//	Add some lights to the scene
		const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		const spotLight = new THREE.SpotLight(0xffffff, 0.5, 0, 0.1, 1);
		directionalLight.position.set(1, 1, 2);
		spotLight.position.set(10, 15, 10);
		spotLight.castShadow = true;
		scene.add(hemiLight);
		scene.add(ambientLight);
		scene.add(directionalLight);

		//	Setup the orbit controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.minPolarAngle = 70 * (Math.PI / 180);
		controls.maxPolarAngle = 90 * (Math.PI / 180);
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.5;
		controls.enablePan = false;
		controls.enableZoom = false;
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.target.set(0, 0, 0);

		//	Store the scene, camera, and renderer
		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		this.controls = controls;

		//	Append the renderer to this component
		this.container!.appendChild(renderer.domElement);
		this.render();
	};

	/**
	 * Loads the drone model and adds it to the scene.
	 */
	private loadDrone = () => {
		//	Load the drone model
		const loader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderConfig({ type: 'js' });
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
		loader.setDRACOLoader(dracoLoader);
		loader.load(
			'/models/Mavic 3.glb',
			async (gltf) => {
				const model = gltf.scene;
				model.scale.set(DroneViewer.MODEL_SCALE, DroneViewer.MODEL_SCALE, DroneViewer.MODEL_SCALE);
				model.rotateX(-4 * (Math.PI / 180));
				await this.renderer.compileAsync(model, this.camera, this.scene);
				this.add(model);
				this.render();
			},
			undefined,
			(error) => {
				console.error(error);
			},
		);
	};

	/**
	 * Sets up the contact shadow for the drone model by creating the necessary planes and cameras.
	 */
	private setupContactShadow = () => {
		//	Create a group to hold the contact shadow
		const shadowGroup = new THREE.Group();
		shadowGroup.position.y = -0.3;

		//	Render target for the contact shadow, used for the plane texture
		const renderTarget = new THREE.WebGLRenderTarget(512, 512);
		renderTarget.texture.generateMipmaps = false;

		//	The render target that we will use to blur the first render target
		const renderTargetBlur = new THREE.WebGLRenderTarget(512, 512);
		renderTargetBlur.texture.generateMipmaps = false;

		//	Create a new plane to render the shadow texture
		const planeGeometry = new THREE.PlaneGeometry(DroneViewer.PLANE_WIDTH, DroneViewer.PLANE_HEIGHT);
		const planeMaterial = new THREE.MeshBasicMaterial({
			map: renderTarget.texture,
			opacity: DroneViewer.SHADOW_OPACITY,
			transparent: true,
			depthWrite: false,
		});
		planeGeometry.rotateX(Math.PI / 2);
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.renderOrder = 1;
		plane.scale.y = -1;

		//	Create another plane to blur the shadow texture
		const blurPlane = new THREE.Mesh(planeGeometry);
		blurPlane.visible = false;

		//	Create a new camera to render the shadow texture
		const shadowCamera = new THREE.OrthographicCamera(
			-DroneViewer.PLANE_WIDTH / 2,
			DroneViewer.PLANE_WIDTH / 2,
			DroneViewer.PLANE_HEIGHT / 2,
			-DroneViewer.PLANE_HEIGHT / 2,
			0,
			DroneViewer.SHADOW_CAMERA_HEIGHT,
		);
		shadowCamera.rotation.x = Math.PI / 2;

		//	Add the planes and camera to the shadow group
		shadowGroup.add(plane);
		shadowGroup.add(blurPlane);
		shadowGroup.add(shadowCamera);
		this.add(shadowGroup);

		//	Create a new material for the shadow plane
		const depthMaterial = new THREE.MeshDepthMaterial();
		depthMaterial.userData.darkness = { value: DroneViewer.SHADOW_DARKNESS };
		depthMaterial.onBeforeCompile = (shader) => {
			shader.uniforms.darkness = depthMaterial.userData.darkness;
			shader.fragmentShader = /* glsl */ `
						uniform float darkness;
						${shader.fragmentShader.replace(
							'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
							'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );',
						)}
					`;
		};
		depthMaterial.depthTest = false;
		depthMaterial.depthWrite = false;

		//	Create materials to blur the shadow texture
		const horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
		horizontalBlurMaterial.depthTest = false;
		const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
		verticalBlurMaterial.depthTest = false;

		//	Store the needed variables
		this.renderTarget = renderTarget;
		this.renderTargetBlur = renderTargetBlur;
		this.plane = plane;
		this.blurPlane = blurPlane;
		this.shadowCamera = shadowCamera;
		this.depthMaterial = depthMaterial;
		this.horizontalBlurMaterial = horizontalBlurMaterial;
		this.verticalBlurMaterial = verticalBlurMaterial;
	};

	/**
	 * Blurs the shadow plane
	 */
	private blurShadow = (amount: number) => {
		this.blurPlane.visible = true;

		//	Blur horizontally and draw in the renderTargetBlur
		this.blurPlane.material = this.horizontalBlurMaterial;
		(this.blurPlane.material as any).uniforms.tDiffuse.value = this.renderTarget.texture;
		this.horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256;

		//	Render to the blur render target
		this.renderer.setRenderTarget(this.renderTargetBlur);
		this.renderer.render(this.blurPlane, this.shadowCamera);

		//	Blur vertically and draw in the main renderTarget
		this.blurPlane.material = this.verticalBlurMaterial;
		(this.blurPlane.material as any).uniforms.tDiffuse.value = this.renderTargetBlur.texture;
		this.verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256;

		//	Render to the main render target
		this.renderer.setRenderTarget(this.renderTarget);
		this.renderer.render(this.blurPlane, this.shadowCamera);

		this.blurPlane.visible = false;
	};

	/**
	 * Function to trigger a single render frame
	 */
	private animateFrame = () => {
		requestAnimationFrame(() => this.animateFrame());

		//	Capture a snapshot of the drone for contact shadows by removing everything else from the scene
		const initialBackground = this.scene.background;
		this.scene.background = null;
		this.scene.overrideMaterial = this.depthMaterial;
		const initialClearAlpha = this.renderer.getClearAlpha();
		this.renderer.setClearAlpha(0);
		this.renderer.setRenderTarget(this.renderTarget);
		this.render(true);

		//	Blur the shadow with two passes to get rid of artifacts
		this.blurShadow(DroneViewer.SHADOW_BLUR);
		this.blurShadow(DroneViewer.SHADOW_BLUR * 0.4);

		//	Then return the scene to its original state
		this.scene.overrideMaterial = null;
		this.renderer.setRenderTarget(null);
		this.renderer.setClearAlpha(initialClearAlpha);
		this.scene.background = initialBackground;

		//	Render the scene and update the controls
		this.render();
		this.updateControls();
	};
}

customElements.define('ui-drone-viewer', DroneViewer);
