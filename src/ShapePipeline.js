import {
  MeshBasicMaterial,
  LineBasicMaterial,
  BufferGeometry,
  BoxBufferGeometry,
  ConeBufferGeometry,
  TorusBufferGeometry,
  SphereBufferGeometry,
  Mesh,
  Line,
  EllipseCurve
} from "three";
import shapes from "./Shapes";
import { eccentricityFactor } from "./constants";

const RadsPerDegree = Math.PI / 180;
const RightAngle = Math.PI / 2;

export default function shapePipeline(spec) {
  let geo, obj;
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
    case shapes.ellipse:
      let eccentricity = spec.dims.eccentricity | 0;
      let major = spec.dims.aphelion + spec.dims.perihelion;
      let minor = major * Math.sqrt(1 - Math.pow(eccentricity, 2));
      let curve = new EllipseCurve(
        spec.dims.aphelion - spec.dims.perihelion,
        0,
        minor,
        major
      );
      let points = curve.getPoints(500);
      geo = new BufferGeometry().setFromPoints(points);
      mat = new LineBasicMaterial({ color: spec.color });
      break;
    default:
      return undefined;
  }

  if (spec.type == shapes.ellipse) {
    obj = new Line(geo, mat);
    obj.rotation.x = RightAngle;
    obj.rotation.y = spec.dims.OrbitalInclination * RadsPerDegree;
    obj.rotation.z = RightAngle;
  } else {
    obj = new Mesh(geo, mat);
    obj.position.set(spec.pos.x, spec.pos.y, spec.pos.z);
  }
  return obj;
}
