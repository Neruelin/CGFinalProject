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
  startTime = Date.now(),
  timeScale = 1000,
  gui = new dat.GUI({autoPlace: true}),
  guiObject = {target: "", timeScale: timeScale},
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
    x: major * Math.cos((radsPerSec * t * timeScale) / period),
    y: minor * Math.sin((radsPerSec * t * timeScale) / period)
  };
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
  folder
    .add(guiObject, 'target')
    .name("Target")
    .onChange(setLockon);

    let timeScales = {
      real: false,
      ten: false,
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
      .add(timeScales, 'ten')
      .name('x10')
      .listen().onChange(function(){
        setChecked("ten");
        timeScale = 10;
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
  
  // timeFolder
  //   .add(guiObject, "timeScale").min(1).max(50000).step(1000)
  //   .name("Scale")
  //   .onChange(val => {timeScale = val});
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