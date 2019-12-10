import {
  AmbientLight,
  BackSide,
  BoxBufferGeometry,
  Color,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  ShaderLib,
  ShaderMaterial,
  TextureLoader,
  WebGLRenderer,
  Vector3,
  MeshBasicMaterial,
  SphereBufferGeometry,
} from "three";
import "./styles/app.css";
import * as dat from "dat.gui";
import { OrbitControls } from "./OrbitControls";
import { Lensflare, LensflareElement } from "./Lensflare";
import { Orbits, SpaceObjects, PhysicsObjects } from "./ObjectsToCreate";
import shapePipeline from "./ShapePipeline";

import { 
  AU,
  radsPerSec,
  background,
  farOcclusionDistance,
  Gravity,
  SpeedLimit,
  scaleUp
} from "./constants";

let scene,
  camera,
  renderer,
  controls,
  lockon,
  startTime = 81363000000000,
  timeScale = 1,
  lastTime = Date.now(),
  gui = new dat.GUI({autoPlace: true}),
  guiObject = {
    target: "",
    unlock: function() {
      setLockon("");
    },
    clearMarkers: () => {
      let marker;
      for (marker of addedMarkers) {
        scene.remove(marker);
      }
    },
    lockonDistance: 20,
    //timeScale: timeScale,
    coldSun: false,
    showOrbits: true,
    sizeScales: {
      scaledup: true,
      actualSize: false
    },
    timeScales: {
      stopped: false,
      real: true,
      hundred: false,
      thousand: false,
      tenThousand: false
    },
    ShowFullTelemetry: false,
    placeMarkers: true
  },
  sun,
  sunLight,
  objects = [],
  orbits = [],
  addedMarkers = [],
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
  camera.position.set(0, AU, 0);
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
  let major = (x + y)/ 2;
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
  div.className = "Overlay";
  div.onclick = e => {
    setLockon(key);
  };
  return div;
}

function initScene() {
  scene = new Scene();
  scene.background = new Color(background);
  scene.add(camera);

  let key;
  for (key of Object.keys(SpaceObjects)) {
    let obj = shapePipeline(SpaceObjects[key]);
    SpaceObjects[key].obj = obj;
    obj.name = key;

    if (key == "Sun")
      obj.scale.set(0.0075, 0.0075, 0.0075);

    objects.push(obj);
    scene.add(obj);

    let div = createOverlayDiv(key);
    overlayDivs[key] = div;
    document.body.appendChild(overlayDivs[key]);
  }

  for (key of Object.keys(Orbits)) {
    let obj = shapePipeline(Orbits[key]);
    orbits.push(obj);
    scene.add(obj);
  }

  for (key of Object.keys(PhysicsObjects)) {
    let obj = shapePipeline(PhysicsObjects[key]);
    PhysicsObjects[key].obj = obj;
    objects.push(obj);
    scene.add(obj);
    let div = createOverlayDiv(key);
    overlayDivs[key] = div;
    console.log(key);
    addMarkerTracking(key);
    document.body.appendChild(overlayDivs[key]);
  }

  const textureLoader = new TextureLoader();

  sunLight = new PointLight(0xffffff, 2, 0, 0);
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

  const plane = new BoxBufferGeometry(200 * AU, 200 * AU, 200 * AU);
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
  let t = Date.now() - startTime;
  for (key of Object.keys(SpaceObjects)) {
    SpaceObjects[key].obj
      .rotateOnAxis(new Vector3(0, 1, 0), ((2*Math.PI) / SpaceObjects[key].day) * timeScale);

    if (key == "Sun" || key == "Moon") continue;
    let period = Orbits[key].dims.period;

    let pos = parametricEllipse(
      Orbits[key].dims.perihelion,
      Orbits[key].dims.aphelion,
      t,
      period,
      Orbits[key].dims.eccentricity | 0
      );

    let oldPosition = SpaceObjects[key].obj.position.clone();
    
    SpaceObjects[key].obj.position.y =
      pos.x * Math.sin((Orbits[key].dims.OrbitalInclination * Math.PI) / 180);

    SpaceObjects[key].obj.position.x =
      pos.x * Math.cos((Orbits[key].dims.OrbitalInclination * Math.PI) / 180);

    SpaceObjects[key].obj.position.z =
      pos.y + Orbits[key].dims.aphelion - Orbits[key].dims.perihelion;
    
    SpaceObjects[key].velocity = new Vector3()
      .subVectors(oldPosition, SpaceObjects[key].obj.position)
      .divideScalar(lastTime - Date.now())
      .multiplyScalar(timeScale);
  }
}

function addMarkerTracking (key) {
  setInterval(() => {
    let a = PhysicsObjects[key].obj.position;
    if (guiObject.placeMarkers) {
      addedMarkers.push(addAt(a.x, a.y, a.z, PhysicsObjects[key].color));
    }
  }, 1000);
}

function updateCameraPosition () {
  if (lockon in SpaceObjects) {
    let v1 = camera.position.clone();
    let v2 = SpaceObjects[lockon].obj.position.clone();
    let obj2cam = new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    let norm = obj2cam.normalize();
    let dist;
    if (guiObject.sizeScales.scaledup)
      dist = SpaceObjects[lockon].dims.actualRadius * scaleUp * guiObject.lockonDistance;
    else
      dist = SpaceObjects[lockon].dims.actualRadius * guiObject.lockonDistance;
    let nXd = new Vector3(norm.x * dist, norm.y * dist, norm.z * dist);
    let final = new Vector3(nXd.x + v2.x, nXd.y + v2.y, nXd.z + v2.z);
    camera.position.set(final.x, final.y, final.z);
    controls.target = new Vector3(v2.x, v2.y, v2.z);
  } else if (lockon in PhysicsObjects) {
    let v1 = camera.position.clone();
    let v2 = PhysicsObjects[lockon].obj.position.clone();
    let obj2cam = new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    let norm = obj2cam.normalize();
    let dist;
    if (guiObject.sizeScales.scaledup)
      dist = PhysicsObjects[lockon].dims.actualRadius * scaleUp * guiObject.lockonDistance;
    else
      dist = PhysicsObjects[lockon].dims.actualRadius * guiObject.lockonDistance;
    let nXd = new Vector3(norm.x * dist, norm.y * dist, norm.z * dist);
    let final = new Vector3(nXd.x + v2.x, nXd.y + v2.y, nXd.z + v2.z);
    camera.position.set(final.x, final.y, final.z);
    controls.target = new Vector3(v2.x, v2.y, v2.z);
  }
}

function updateOverlayPositions() {
  let key;
  for (key of Object.keys(SpaceObjects)) {
    if(key == "Moon") continue;
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

    if (key !== "Sun") {
      overlayDivs[key].innerText = key;
      if (guiObject.ShowFullTelemetry) {
        overlayDivs[key].innerText +=
          "\n" +
          (SpaceObjects[key].obj.position.x / AU).toPrecision(2) +
          "AU\n" +
          (SpaceObjects[key].obj.position.y / AU).toPrecision(2) +
          "AU\n" +
          (SpaceObjects[key].obj.position.z / AU).toPrecision(2) +
          "AU\n" +
          (SpaceObjects[key].obj.position.length() / AU).toPrecision(2) +
          "AU\n" +
          (SpaceObjects[key].velocity.x / 1000).toPrecision(5) +
          " Km/s\n" +
          (SpaceObjects[key].velocity.y / 1000).toPrecision(5) +
          " Km/s\n" +
          (SpaceObjects[key].velocity.z / 1000).toPrecision(5) +
          " Km/s\n" +
          (SpaceObjects[key].velocity.length() / 1000).toPrecision(5) +
          " Km/s";
      }
    }

    overlayDivs[key].style.transform = `translate(-50%, -50%) translate(${
      pos.x
    }px,${pos.y - 10}px)`;
  }

  for (key of Object.keys(PhysicsObjects)) {
    let pos = toScreenPosition(PhysicsObjects[key].obj, camera);
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
    overlayDivs[key].innerText = key;
    if (guiObject.ShowFullTelemetry) {

      overlayDivs[key].innerText +=
        "\n" +
        (PhysicsObjects[key].obj.position.x / AU).toPrecision(2) +
        "AU\n" +
        (PhysicsObjects[key].obj.position.y / AU).toPrecision(2) +
        "AU\n" +
        (PhysicsObjects[key].obj.position.z / AU).toPrecision(2) +
        "AU\n" +
        (PhysicsObjects[key].obj.position.length() / AU).toPrecision(2) +
        "AU\n" +
        (PhysicsObjects[key].velocity.x / 1000).toPrecision(5) +
        " Km/s\n" +
        (PhysicsObjects[key].velocity.y / 1000).toPrecision(5) +
        " Km/s\n" +
        (PhysicsObjects[key].velocity.z / 1000).toPrecision(5) +
        " Km/s\n" +
        (PhysicsObjects[key].velocity.length() / 1000).toPrecision(5) +
        " Km/s";
    }

    overlayDivs[key].style.transform = `translate(-50%, -50%) translate(${
      pos.x
    }px,${pos.y - 10}px)`;
  }
}

function calcGravForce(obj) {
  let force = new Vector3();
  let key;
  for (key of Object.keys(SpaceObjects)) {
    let SpaceObject = SpaceObjects[key];
    let v1 = SpaceObject.obj.position.clone();
    let v2 = obj.obj.position.clone();
    let dirVec = new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    let mag =
      (Gravity * SpaceObject.dims.mass * obj.dims.mass) / dirVec.length() ** 2;
    if (mag > SpeedLimit) mag = SpeedLimit;
    force.addScaledVector(dirVec.normalize(), mag);
  }
  return force;
}

function calcVelocity(accel, time) {
  return accel * time;
}

function calcDisplacement(oldvelocity, newvelocity, accel, time) {
  let velocity = (oldvelocity + newvelocity) / 2;

  return (velocity + 0.5 * accel * time) * time;
}

function updatePhysicsObjectPositions() {
  let delta = (timeScale * (Date.now() - lastTime)) / 1000;
  lastTime = Date.now();
  let key;
  for (key of Object.keys(PhysicsObjects)) {
    let displacement = new Vector3();
    let GravForce = calcGravForce(PhysicsObjects[key]);
    let dim;
    for (dim of ["x", "y", "z"]) {
      let vel =
        PhysicsObjects[key].velocity[dim] + calcVelocity(GravForce[dim], delta);
      displacement[dim] = calcDisplacement(
        PhysicsObjects[key].velocity[dim],
        vel,
        GravForce[dim],
        delta
      );
      PhysicsObjects[key].velocity[dim] = vel;
    }
    PhysicsObjects[key].obj.position.add(displacement);
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateObjectPositions();
  updatePhysicsObjectPositions();
  controls.update();
  updateCameraPosition();
  updateOverlayPositions();
  renderer.render(scene, camera);
}

function initGUI() {
  let folder = gui.addFolder("Lock On");
  folder.add(guiObject, "target").onChange(setLockon).name("Target");
  folder.add(guiObject, "lockonDistance", 0.001, 25.0, 0.001).name("Zoom");
  folder.add(guiObject, "unlock").name("Unlock");

  let markerFolder = gui.addFolder("Marker");
  markerFolder.add(guiObject, "placeMarkers");
  markerFolder.add(guiObject, "clearMarkers");

  let metricsFolder = gui.addFolder("Telemetry");
  metricsFolder.add(guiObject, "ShowFullTelemetry");
  
  let timeFolder = gui.addFolder("Time Controls");
  timeFolder.add(guiObject.timeScales, 'stopped').name('Stopped')
    .listen().onChange(function(){
      setChecked("stopped", guiObject.timeScales);
      timeScale = 0;
    });

  timeFolder.add(guiObject.timeScales, 'real').name('Real Time')
    .listen().onChange(function(){
      setChecked("real", guiObject.timeScales);
      timeScale = 1;
    });

  timeFolder.add(guiObject.timeScales, 'hundred').name('x100')
    .listen().onChange(function(){
      setChecked("hundred", guiObject.timeScales);
      timeScale = 100;
    });

  timeFolder.add(guiObject.timeScales, 'thousand').name('x1000')
    .listen().onChange(function(){
      setChecked("thousand", guiObject.timeScales);
      timeScale = 1000;
    });
  
  timeFolder.add(guiObject.timeScales, 'tenThousand').name('x10000')
    .listen().onChange(function(){
      setChecked("tenThousand", guiObject.timeScales);
      timeScale = 10000;
    });

  let scaleFolder = gui.addFolder("Size Controls");
  scaleFolder.add(guiObject.sizeScales, "scaledup").name("Scaled up")
    .listen().onChange(function() {
      setChecked("scaledup", guiObject.sizeScales);
      let obj;
      for (obj of (objects)) {
        if(obj.name == "Sun")
          obj.scale.set(0.075, 0.075, 0.075);
        else
          obj.scale.set(1.0, 1.0, 1.0);
      }
    });

    scaleFolder.add(guiObject.sizeScales, "actualSize").name("Actual size")
    .listen().onChange(function() {
      setChecked("actualSize", guiObject.sizeScales);
      let obj;
      for (obj of (objects)) {
        obj.scale.set(0.001, 0.001, 0.001);
      }
    });

  function setChecked( prop, list ){
    for (let param in list){
      list[param] = false;
    }
    list[prop] = true;
  }

  let graphicalOptions = gui.addFolder("Graphical Options");
  graphicalOptions.add(guiObject, "coldSun").name("Ultraviolet Sun")
    .listen().onChange(function(flag) {
      let obj;
      for (obj of objects) {
        if (obj.name == "Sun")
        {
          if (flag) {
            sunLight.children[0].visible = false;
            obj.visible = true;
          } else {
            sunLight.children[0].visible = true;
            obj.visible = false;
          }
        }
      }
    });

  graphicalOptions.add(guiObject, "showOrbits").name("Show orbits")
    .listen().onChange(function(flag) {
      let obj;
      for (obj of orbits) {
        if (flag)
          obj.visible = true;
         else
          obj.visible = false;
      }
    });
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
  if (target && (target in SpaceObjects || target in PhysicsObjects)) {
    lockon = target;
    console.log("Locked on " + target);
  } else {
    if (lockon) {
      console.log("invalid lockon");
      lockon = undefined;
    }
  }
}

function addAt(x, y, z, col = 0xff0000) {
  let geo = new SphereBufferGeometry(0.01 * AU, 10, 10);
  let mat = new MeshBasicMaterial({ color: col });
  let mesh = new Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.renderOrder = 10;
  scene.add(mesh);
  return mesh;
}

function createProbe(pos, vel, color, name) {
  PhysicsObjects[name] = {
    type: Shapes.cube,
    dims: {
      size: 30,
      radius: 30,
      mass: 500
    },
    velocity: vel,
    pos: {
      x: pos.x,
      y: pos.y,
      z: pos.z
    },
    color: color
  };
  PhysicsObjects[name].obj = shapePipeline(PhysicsObjects[name]);
  overlayDivs[name] = createOverlayDiv(name);
  document.body.appendChild(overlayDivs[name]);
  scene.add(PhysicsObjects[name].obj);

  setInterval(() => {
    let a = PhysicsObjects[name].obj.position;
    if (guiObject.placeMarkers) {
      addedMarkers.push(addAt(a.x, a.y, a.z, color));
    }
  }, 5000);
}

init();

console.log(PhysicsObjects);