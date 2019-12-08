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
import { Lensflare, LensflareElement } from "./Lensflare";
import STLLoader from "./STLLoader";
import { Orbits, SpaceObjects } from "./ObjectsToCreate";
import shapePipeline from "./ShapePipeline";

import { AU, radsPerSec, background, farOcclusionDistance } from "./constants";

let scene,
  camera,
  renderer,
  controls,
  lockon,
  startTime = 81363000000000,
  timeScale = 1000,
  gui = new dat.GUI({autoPlace: true}),
  guiObject = {
    target: "",
    unlock: function() {
      setLockon("");
    },
    lockonDistance: 20,
    timeScale: timeScale
  },
  objects = [],
  overlayDivs = [];

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
  camera.position.set(0, 500000, 0);
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
    x: major * Math.cos((radsPerSec * t * timeScale) / period),
    y: minor * Math.sin((radsPerSec * t * timeScale) / period)
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

function initScene() {
  scene = new Scene();
  scene.background = new Color(background);
  scene.add(camera);

  // let axes2 = new AxisHelper(1000000000);
  // scene.add(axes2);

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

  const textureLoader = new TextureLoader();

  let sunLight = new PointLight(0xffffff, 2, 0, 0);
  sunLight.position.set(0, 0, 0);

  let flare = textureLoader.load("./assets/textures/flare.png");
  let lensflare = new Lensflare();
  lensflare.renderOrder = 2;
  lensflare.addElement( new LensflareElement(flare, 100, 0, new Color(0xFFFFFF)));

  sunLight.add(lensflare);

  scene.add(sunLight);

  let ambient = new AmbientLight(0xffffff, 0.2);
  scene.add(ambient);

  let sky;

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
  let v4 = new Vector3();
  camera.getWorldDirection(v4);
  let dot = v3.dot(v4);

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
    let period = Orbits[key].dims.period;

    let pos = parametricEllipse(
      Orbits[key].dims.perihelion,
      Orbits[key].dims.aphelion,
      Date.now() - startTime,
      period,
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
    controls.target = new Vector3(v2.x, v2.y, v2.z);
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
}

function initGUI() {
  let folder = gui.addFolder("Lock On");
  folder.add(guiObject, "target").onChange(setLockon);
  folder.add(guiObject, "lockonDistance", 1, 50);
  folder.add(guiObject, "unlock");

  let timeScales = {
    real: false,
    hundred: false,
    thousand: true,
    tenThousand: false
  }
  
  let timeFolder = gui.addFolder("Time Controls");
  timeFolder
    .add(timeScales, 'real')
    .name('Real Time')
    .listen().onChange(function(){
      setChecked("real");
      timeScale = 1;
    });

  timeFolder
    .add(timeScales, 'hundred')
    .name('x100')
    .listen().onChange(function(){
      setChecked("hundred");
      timeScale = 100;
    });

  timeFolder
    .add(timeScales, 'thousand')
    .name('x1000')
    .listen().onChange(function(){
      setChecked("thousand");
      timeScale = 1000;
    });
  
  timeFolder
    .add(timeScales, 'tenThousand')
    .name('x10000')
    .listen().onChange(function(){
      setChecked("tenThousand");
      timeScale = 10000;
    });
  
  function setChecked( prop ){
    for (let param in timeScales){
      timeScales[param] = false;
    }
    timeScales[prop] = true;
  }
}

function init() {
  initGUI();
  initCamera();
  initRenderer();
  initControls();
  initScene();
  animate();
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
