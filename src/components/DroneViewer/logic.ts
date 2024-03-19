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
	static SHADOW_CAMERA_HEIGHT = 5;

	scene: THREE.Scene = new THREE.Scene();
	camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
	renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
	renderTarget: THREE.WebGLRenderTarget = new THREE.WebGLRenderTarget(512, 512);
	renderTargetBlur: THREE.WebGLRenderTarget = new THREE.WebGLRenderTarget(512, 512);
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

		//	Setup the scene
		this.setupScene();

		//	Load the drone model
		this.loadDrone();

		//	Setup the contact shadow
		this.setupContactShadow();

		//	Start the animation loop
		this.animateFrame();
	}

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
		controls.addEventListener('change', () => this.render());
		controls.minPolarAngle = Math.PI * (1 / 4);
		controls.maxPolarAngle = Math.PI * (3 / 4);
		controls.enablePan = false;
		controls.enableZoom = false;
		controls.target.set(0, 0, 0);
		controls.update();

		//	Store the scene, camera, and renderer
		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;

		//	Append the renderer to this component
		this.shadowRoot!.appendChild(renderer.domElement);
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
	 * Sets up the contact shadow for the drone model.
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
			opacity: 1,
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

		//	Add a helper to visualize the shadow camera, and add the shadow group to the scene
		const cameraHelper = new THREE.CameraHelper(shadowCamera);
		this.add(shadowGroup);
		this.add(cameraHelper);

		//	Create a new material for the shadow plane
		const depthMaterial = new THREE.MeshDepthMaterial();
		depthMaterial.userData.darkness.value = 1;
		depthMaterial.onBeforeCompile = function (shader) {
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

		// blur horizontally and draw in the renderTargetBlur
		this.blurPlane.material = this.horizontalBlurMaterial;
		this.blurPlane.material.uniforms.tDiffuse.value = this.renderTarget.texture;
		this.horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256;

		this.renderer.setRenderTarget(this.renderTargetBlur);
		this.renderer.render(this.blurPlane, this.shadowCamera);

		// blur vertically and draw in the main renderTarget
		this.blurPlane.material = this.verticalBlurMaterial;
		this.blurPlane.material.uniforms.tDiffuse.value = this.renderTargetBlur.texture;
		this.verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256;

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
		this.blurShadow(3.5);
		this.blurShadow(3.5 * 0.4);

		//	Then return the scene to its original state
		this.scene.overrideMaterial = null;
		this.renderer.setRenderTarget(null);
		this.renderer.setClearAlpha(initialClearAlpha);
		this.scene.background = initialBackground;

		//	Render the scene
		this.render();
	};

	add = (object: THREE.Object3D) => this.scene.add(object);
	render = (shadow: boolean = false) => this.renderer.render(this.scene, shadow ? this.shadowCamera : this.camera);
}

customElements.define('ui-drone-viewer', DroneViewer);
