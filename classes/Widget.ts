import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface IOptions {
  orbitControls?: boolean;
  axisHelper?: boolean;
}
const defaultOptions: IOptions = {
  orbitControls: false,
  axisHelper: false,
};

export class Widget {
  canvas: HTMLElement;
  renderer: THREE.Renderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  controls: OrbitControls | undefined;

  constructor(canvas: HTMLElement, options?: IOptions) {
    const opt = { ...defaultOptions, ...options };
    this.canvas = canvas;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    if (opt.axisHelper) {
      scene.add(new THREE.AxesHelper());
    }

    const camera: THREE.OrthographicCamera = this.initCamera();
    if (opt.orbitControls) {
      const controls = new OrbitControls(camera, canvas);
      controls.target.set(0, 0, 0);
      controls.update();
      this.controls = controls;
    }
    this.camera = camera;

    requestAnimationFrame(this.render.bind(this));
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
    }
    return needResize;
  }

  render() {
    if (this.controls) this.controls.update();

    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.renderer.domElement;
      const aspect = canvas.clientWidth / canvas.clientHeight;
      if (aspect > 1) {
        this.camera.top = 0.5 + 0.5 / aspect;
        this.camera.bottom = 0.5 - 0.5 / aspect;
      } else {
        this.camera.left = 1 - aspect;
      }
      this.camera.updateProjectionMatrix();
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  initCamera() {
    const left = 0;
    const right = 1;
    const top = 1;
    const bottom = 0;
    const near = -2;
    const far = 2;
    const camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near,
      far
    );

    camera.lookAt(0, 0, 0);
    return camera;
  }
}
