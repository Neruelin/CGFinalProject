import {
  AxesHelper,
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
  // OrthographicCamera
} from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "./OrbitControls";
import STLLoader from "./STLLoader";
import { Orbits, SpaceObjects } from "./ObjectsToCreate";
import shapePipeline from "./ShapePipeline";

import { AU, radsPerSec, background, farOcclusionDistance } from "./constants";

let scene,
  camera,
  renderer,
  controls,
  gui = new dat.GUI({ autoPlace: true }),
  overlayDivs = [],
  lockon,
  guiObject = {
    target: "",
    unlock: function() {
      setLockon("");
    }
  },
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

  renderer.domElement.id = "meCanvas";
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

function createOverlayDiv(key) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(key));
  div.id = key;
  div.onclick = e => {
    setLockon(key);
  };
  div.style.cssText =
    "position: absolute; top: 0px; left: 0px; border: 1px solid green; color: green; background-color: rgba(1,1,1,0.2);";
  return div;
}

console.log(createOverlayDiv);

function initScene() {
  scene = new Scene();
  scene.background = new Color(background);
  scene.add(camera);

  let axes2 = new AxesHelper(1000000000);
  scene.add(axes2);

  let key;
  for (key of Object.keys(SpaceObjects)) {
    let obj = shapePipeline(SpaceObjects[key]);
    SpaceObjects[key].obj = obj;
    objects.push(obj);
    scene.add(obj);

    let div = createOverlayDiv(key);
    overlayDivs[key] = div;
    document.body.appendChild(overlayDivs[key]);
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
  const skyTexture = textureLoader.load(
    "./assets/textures/8k_stars_milky_way.jpg"
  );

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

function toScreenPosition(obj, camera) {
  var vector = new Vector3();

  var widthHalf = 0.5 * renderer.getContext().canvas.width;
  var heightHalf = 0.5 * renderer.getContext().canvas.height;

  obj.updateMatrixWorld(true, false);
  obj.getWorldPosition(vector);
  vector.project(camera);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;

  let v1 = camera.position.clone();
  let v2 = obj.position.clone();
  let v3 = new Vector3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
  let v4 = camera.getWorldDirection();
  let dot = v3.dot(v4);

  // console.log(dot);

  if (dot <= 0) {
    return {
      x: 0,
      y: 0
    };
  }

  return {
    x: vector.x,
    y: vector.y
  };
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
    controls.target = new Vector3(
      SpaceObjects[lockon].obj.position.x,
      SpaceObjects[lockon].obj.position.y,
      SpaceObjects[lockon].obj.position.z
    );
  }
}

function updateOverlayPositions() {
  let key;
  for (key of Object.keys(SpaceObjects)) {
    let pos = toScreenPosition(SpaceObjects[key].obj, camera);
    if (
      pos.x < renderer.getContext().canvas.width &&
      pos.x >= 0 &&
      pos.y < renderer.getContext().canvas.height &&
      pos.y >= 0
    ) {
      overlayDivs[key].style.visibility = "visible";
    } else {
      overlayDivs[key].style.visibility = "hidden";
      pos.x = 0;
      pos.y = 0;
    }

    overlayDivs[key].style.transform = `translate(-50%, -50%) translate(${
      pos.x
    }px,${pos.y - 10}px)`;
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateObjectPositions();
  updateOverlayPositions();
  renderer.render(scene, camera);
  // let pos = toScreenPosition(SpaceObjects["Sun"].obj, camera);
}

function initGUI() {
  let folder = gui.addFolder("Lock On");
  folder.add(guiObject, "target").onChange(setLockon);
  folder.add(guiObject, "unlock");
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
}

init();

function print() {
  console.log(overlayDivs);
}
console.log(print);
