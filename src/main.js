import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  MeshBasicMaterial,
  Mesh,
  SphereBufferGeometry,
  BoxBufferGeometry,
  ConeBufferGeometry,
  TorusBufferGeometry,
  PointLight
} from "three";

import { OrbitControls } from "./OrbitControls";
import STLLoader from "./STLLoader";

const background = 0x000000;

let scene,
  camera,
  renderer,
  controls,
  objects = [];

let sI = 0;

const shapes = {
  sphere: sI++,
  box: sI++,
  cone: sI++,
  torus: sI++
};

let ObjectsToCreate = [
  {
    type: shapes.sphere,
    dims: {
      radius: 1,
      widthSegments: 8,
      heightSegments: 6
    },
    pos: {
      x: 1,
      y: 1,
      z: 1
    },
    color: 0x00ff00
  },
  {
    type: shapes.cube,
    dims: {
      size: 1
    },
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x0000ff
  },
  {
    type: shapes.cube,
    dims: {
      size: 1
    },
    pos: {
      x: 1,
      y: 1,
      z: 0
    },
    color: 0xff0000
  }
];

function shapePipeline(spec) {
  let geo;
  let mat = new MeshBasicMaterial({ color: spec.color });
  switch (spec.type) {
    case shapes.sphere:
      geo = new SphereBufferGeometry(
        spec.dims.radius,
        spec.dims.widthSegments,
        spec.dims.heightSegments
      );
      break;
    case shapes.box:
      geo = new BoxBufferGeometry(
        spec.dims.width,
        spec.dims.height,
        spec.dims.depth
      );
      break;
    case shapes.cone:
      geo = new ConeBufferGeometry(spec.dims.radius, spec.dims.height);
      break;
    case shapes.torus:
      geo = new TorusBufferGeometry(spec.dims.radius, spec.dims.tube);
      break;
    case shapes.cube:
      geo = new BoxBufferGeometry(
        spec.dims.size,
        spec.dims.size,
        spec.dims.size
      );
      break;
    default:
      return undefined;
  }

  let obj = new Mesh(geo, mat);

  obj.position.set(spec.pos.x, spec.pos.y, spec.pos.z);

  return obj;
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function initCamera() {
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 10, 10);
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

function initScene() {
  scene = new Scene();
  scene.background = new Color(background);
  scene.add(camera);

  let spec;
  for (spec of ObjectsToCreate) {
    let obj = shapePipeline(spec);
    objects.push(obj);
    scene.add(obj);
  }

  let loader = new STLLoader();
  loader.load('./assets/models/atlasv551.stl', function (geometry) {
    scene.add(new Mesh(geometry));
  });

  let light = new PointLight(0xffffff, 1, 0, 0);
  light.position.set(50, 50, 50);
  scene.add(light);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
}

function init() {
  initCamera();
  initRenderer();
  initControls();
  initScene();
  animate();
}

init();
