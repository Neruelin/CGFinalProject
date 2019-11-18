import {
  BackSide,
  BoxBufferGeometry,
  Color,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  ShaderLib,
  ShaderMaterial,
  SphereBufferGeometry,
  TextureLoader,
  WebGLRenderer
} from "three";
import { OrbitControls } from "./OrbitControls";
import STLLoader from "./STLLoader";

import ObjectsToCreate from "./ObjectsToCreate";
import shapePipeline from "./ShapePipeline";

import { AU, radsPerSec, background, farOcclusionDistance } from "./constants";

let scene,
  camera,
  renderer,
  controls,
  startTime = Date.now(),
  objects = [];

let Sun, Earth;

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function initCamera() {
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    farOcclusionDistance
  );
  camera.position.set(0, 100000, 0);
  camera.lookAt(0, 0, 0);
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initRenderer() {
  renderer = new WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function parametricEllipse(x, y, t) {
  return {
    x: x * Math.cos(radsPerSec * t),
    y: y * Math.sin(radsPerSec * t)
  };
}

function initScene() {
  scene = new Scene();
  scene.background = new Color(background);
  scene.add(camera);

  let key;
  for (key of Object.keys(ObjectsToCreate)) {
    let obj = shapePipeline(ObjectsToCreate[key]);
    if (key === "Sun") Sun = obj;
    if (key === "Earth") Earth = obj;
    objects.push(obj);
    scene.add(obj);
  }

  let loader = new STLLoader();
  loader.load("./assets/models/atlasv551.stl", function(geometry) {
    let mat = new MeshBasicMaterial({ color: 0xffffff });
    scene.add(new Mesh(geometry, mat));
  });

  let light = new PointLight(0xffffff, 1, 0, 0);
  light.position.set(0, 1000, 0);
  scene.add(light);

  let sky;

  const textureLoader = new TextureLoader();
  const skyTexture = textureLoader.load("./Assets/8k_stars_milky_way.jpg");

  skyTexture.magFilter = LinearFilter;
  skyTexture.minFilter = LinearFilter;

  const shader = ShaderLib.equirect;
  const shaderMat = new ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: BackSide
  });

  shaderMat.uniforms.tEquirect.value = skyTexture;

  const plane = new BoxBufferGeometry(1000000000, 1000000000, 1000000000);
  sky = new Mesh(plane, shaderMat);
  scene.add(sky);
}

function updateObjectPositions() {
  let pos = parametricEllipse(AU, AU, Date.now() - startTime);

  Earth.position.x = pos.x;
  Earth.position.z = pos.y;
}

function updateObjectPositions() {
  let pos = parametricEllipse(AU, AU, Date.now() - startTime);

  Earth.position.x = pos.x;
  Earth.position.z = pos.y;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateObjectPositions();
  renderer.render(scene, camera);
}

function init() {
  initCamera();
  initRenderer();
  initControls();
  initScene();
  animate();
}

function addAt(x, y, z) {
  let geo = new SphereBufferGeometry(6000, 10, 10);
  let mat = new MeshBasicMaterial({ color: 0xff0000 });
  let mesh = new Mesh(geo, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
}
console.log(addAt);

init();
