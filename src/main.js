import {
  AxisHelper,
  AmbientLight,
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
  WebGLRenderer,
  Vector3
} from "three";
import * as dat from 'dat.gui';
import { OrbitControls } from "./OrbitControls";
import STLLoader from "./STLLoader";
import { Orbits, SpaceObjects } from "./ObjectsToCreate";
import shapePipeline from "./ShapePipeline";

import { AU, radsPerSec, background, farOcclusionDistance } from "./constants";

let scene,
  camera,
  renderer,
  controls,
  gui = new dat.GUI({autoPlace: true}),
  guiObject = {target: "", lockonDistance: 20},
  lockon,
  startTime = Date.now(),
  objects = [];

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

function parametricEllipse(x = 0, y = 0, t, period, eccentricity) {
  let major = x + y;
  let minor = major * Math.sqrt(1 - Math.pow(eccentricity, 2));

  return {
    x: major * Math.cos((radsPerSec * t) / period),
    y: minor * Math.sin((radsPerSec * t) / period)
  };
}

function initScene() {
  scene = new Scene();
  scene.background = new Color(background);
  scene.add(camera);

  let axes2 = new AxisHelper(1000000000);
  scene.add(axes2);

  let key;
  for (key of Object.keys(SpaceObjects)) {
    let obj = shapePipeline(SpaceObjects[key]);
    SpaceObjects[key].obj = obj;
    objects.push(obj);
    scene.add(obj);
  }

  for (key of Object.keys(Orbits)) {
    let obj = shapePipeline(Orbits[key]);
    objects.push(obj);
    scene.add(obj);
  }

  let loader = new STLLoader();
  loader.load("./assets/models/atlasv551.stl", function(geometry) {
    let mat = new MeshBasicMaterial({ color: 0xffffff });
    scene.add(new Mesh(geometry, mat));
  });

  let sunLight = new PointLight(0xffffff, 2, 0, 0);
  sunLight.position.set(0, 1000, 0);
  scene.add(sunLight);

  let ambient = new AmbientLight(0xffffff, 0.2);
  scene.add(ambient);

  let sky;

  const textureLoader = new TextureLoader();
  const skyTexture = textureLoader.load("./assets/textures/8k_stars_milky_way.jpg");

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
  let key;
  for (key of Object.keys(SpaceObjects)) {
    if (key == "Sun") continue;
    let pos = parametricEllipse(
      Orbits[key].dims.perihelion,
      Orbits[key].dims.aphelion,
      Date.now() - startTime,
      Orbits[key].dims.period,
      Orbits[key].dims.eccentricity | 0
    );
    SpaceObjects[key].obj.position.y =
      pos.x * Math.sin((Orbits[key].dims.OrbitalInclination * Math.PI) / 180);
    SpaceObjects[key].obj.position.x =
      pos.x * Math.cos((Orbits[key].dims.OrbitalInclination * Math.PI) / 180);
    SpaceObjects[key].obj.position.z =
      pos.y + Orbits[key].dims.aphelion - Orbits[key].dims.perihelion;
  }
  if (lockon in SpaceObjects) {
    let v1 = camera.position.clone();
    let v2 = SpaceObjects[lockon].obj.position.clone();
    let obj2cam = new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    let norm = obj2cam.normalize();
    let dist = SpaceObjects[lockon].dims.radius * guiObject.lockonDistance;
    let nXd = new Vector3(norm.x * dist, norm.y * dist, norm.z * dist);
    let final = new Vector3(nXd.x + v2.x, nXd.y + v2.y, nXd.z + v2.z);
    camera.position.set(final.x, final.y, final.z);
    controls.target = new Vector3(SpaceObjects[lockon].obj.position.x, SpaceObjects[lockon].obj.position.y, SpaceObjects[lockon].obj.position.z);
  } 
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateObjectPositions();
  renderer.render(scene, camera);
}

function initGUI() {
  let folder = gui.addFolder('Lock On');
  folder.add(guiObject, 'target').onChange(setLockon);
  folder.add(guiObject, 'lockonDistance', 1,50);
}

function init() {
  initGUI();
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

function setLockon(target) {
  if (target && target in SpaceObjects) {
    lockon = target;
    console.log("Locked on " + target);
  } else {
    if (lockon) {
      console.log("invalid lockon");
      lockon = undefined;
    }
  }
  console.log(lockon);
}


init();

// console.log(setLockon);
// setLockon("Earth");
// console.log(controls);

// let objToCamVec = camera.position.subVectors(SpaceObjects["Sun"].obj.position);
// console.log(objToCamVec);
console.log(camera.position)
console.log(SpaceObjects["Sun"].obj.position);
let tema = new Vector3().subVectors(SpaceObjects["Sun"].obj.position, camera.position);
console.log(tema.normalize());
