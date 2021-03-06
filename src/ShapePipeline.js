import {
  MeshStandardMaterial,
  LineBasicMaterial,
  BufferGeometry,
  BoxBufferGeometry,
  ConeBufferGeometry,
  TorusBufferGeometry,
  SphereBufferGeometry,
  RingGeometry,
  TextureLoader,
  Mesh,
  Line,
  EllipseCurve,
  sRGBEncoding,
  MeshBasicMaterial,
  Vector3,
  DoubleSide,
} from "three";
import shapes from "./Shapes";
import { eccentricityFactor, scaleUp } from "./constants";

function parametricEllipse(x = 0, y = 0, t, period, eccentricity) {
  let major = x + y;
  let minor = major * Math.sqrt(1 - Math.pow(eccentricity, 2));

  return {
    x: major * Math.cos((radsPerSec * t) / period),
    y: minor * Math.sin((radsPerSec * t) / period)
  };
}

const RadsPerDegree = Math.PI / 180;
const RightAngle = Math.PI / 2;

export default function shapePipeline(spec) {
  let geo, obj;
  switch (spec.type) {
    case shapes.sphere:
      geo = new SphereBufferGeometry(
        spec.dims.actualRadius * scaleUp,
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
      geo = new ConeBufferGeometry(spec.dims.actualRadius, spec.dims.height);
      break;
    case shapes.torus:
      geo = new TorusBufferGeometry(spec.dims.actualRadius, spec.dims.tube);
      break;
    case shapes.cube:
      geo = new BoxBufferGeometry(
        spec.dims.size,
        spec.dims.size,
        spec.dims.size
      );
      break;
    case shapes.ellipse:
      let eccentricity = spec.dims.eccentricity | 0;
      let major = (spec.dims.aphelion + spec.dims.perihelion) / 2;
      let minor = major * Math.sqrt(1 - Math.pow(eccentricity, 2));
      let curve = new EllipseCurve(
        (spec.dims.aphelion - spec.dims.perihelion),
        0,
        minor,
        major
      );
      let points = curve.getPoints(500);
      geo = new BufferGeometry().setFromPoints(points);
      break;
    default:
      return undefined;
  }

  if (spec.type == shapes.ellipse) {
    let mat = new LineBasicMaterial({ color: spec.color });
    obj = new Line(geo, mat);
    obj.renderOrder = 1;
    obj.rotation.x = RightAngle;
    obj.rotation.y = spec.dims.OrbitalInclination * RadsPerDegree;
    obj.rotation.z = RightAngle;
  } else if (spec.type == shapes.cube) {
      let mat =new MeshBasicMaterial( {color: spec.color});
      obj = new Mesh(geo, mat);
  } else {
    let texture = new TextureLoader().load(spec.texture);
    texture.encoding = sRGBEncoding;
    texture.anisotrophy = 16;

    if(spec.texture == "./assets/textures/2k_sun.jpg") {
       let mat = new MeshBasicMaterial( {map:texture} );
       obj = new Mesh(geo, mat);
       obj.visible = false;
    } else {
      let mat = new MeshStandardMaterial( {map:texture, metalness: 0.5, roughness: 1.0} );
      obj = new Mesh(geo, mat);
      obj.renderOrder = 3;
    }

    if (spec.texture == "./assets/textures/2k_saturn.jpg") {
      let ringGeo = new RingGeometry(spec.rings.innerRad * scaleUp, spec.rings.outerRad * scaleUp, 32, 8);
      let ringTexture = new TextureLoader().load(spec.rings.texture);
      let ringMat = new MeshStandardMaterial( {map:ringTexture, metalness: 0.5, roughness: 1.0, side: DoubleSide} );
      let rings = new Mesh(ringGeo, ringMat);
      rings.rotateOnAxis(new Vector3(1.0, 0.0, 0.0), Math.PI/2);
      obj.add(rings);
    }

    obj.renderOrder = 3;
    obj.rotateOnAxis(new Vector3(0.0, 0.0, 1.0), -spec.tilt);
  }

  if (spec.pos)
    obj.position.set(spec.pos.x, spec.pos.y, spec.pos.z);
  return obj;
}
