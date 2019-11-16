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

const background = 0x00ff00;

var scene,
  camera,
  renderer,
  objects = [];

var sI = 0;

const shapes = {
  sphere: sI++,
  box: sI++,
  cone: sI++,
  torus: sI++
};

var ObjectsToCreate = [
  {
    type: shapes.sphere,
    dims: {
      radius: 1,
      widthSegments: 8,
      heightSegments: 6
    },
    pos: {
      x: 5,
      y: 5,
      z: 0
    },
    color: 0x00ffff
  },
  {
    type: shapes.cube,
    dims: {
      size: 1
    },
    pos: {
      x: 10,
      y: 10,
      z: 0
    },
    color: 0x00ff00
  }
];

init();

function init() {
  initCamera();
  initRenderer();
  initScene();
  animate();
}

function initCamera() {
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 0);
  camera.lookAt(10, 10, 0);
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

function shapePipeline(spec) {
  var geo;
  var mat = new MeshBasicMaterial({ color: spec.color || 0xffffff });
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

  return new Mesh(geo, mat);
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

  let light = new PointLight(0xffffff, 1, 0, 0);
  light.position.set(50, 50, 50);
  scene.add(light);
  console.log(scene);
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
