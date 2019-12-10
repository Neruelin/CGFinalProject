import {
    Scene,
    SphereBufferGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    PointLight,
    AmbientLight,
    ShaderLib,
    ShaderMaterial,
    sRGBEncoding,
    Color,
    LinearFilter,
    BackSide,
    BoxBufferGeometry
} from "three";
import { Lensflare, LensflareElement } from "./Lensflare";

export default function MoonScene(camera) {
    let scene = new Scene();
    
    scene.add(camera);

    let geo, obj, mat;
    geo = new SphereBufferGeometry(
        1.7371 * 1000,
        32,
        32
    );

    let texture = new TextureLoader();
    texture.load("./assets/textures/8k_moon.jpg");
    texture.encoding = sRGBEncoding;
    texture.anisotrophy = 16;
    mat = new MeshStandardMaterial( {map: texture, metalness: 0.5, roughness: 1.0});
    obj = new Mesh(geo, mat);
    obj.position.x = 10000;
    obj.position.y = 0;
    obj.position.z = 10000;

    scene.add(obj);

    let sunLight = new PointLight(0xffffff, 2, 0, 0);
    sunLight.position.set(0, 0, 0);

    let flare = texture.load("./assets/textures/flare.png");
    let lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement(flare, 100, 0, new Color(0xFFFFFF)));

    sunLight.add(lensflare);
    scene.add(sunLight);
    
    let ambient = new AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    // let sky;

    // texture.load("./assets/textures/8k_stars_milky_way.jpg");

    // texture.magFilter = LinearFilter;
    // texture.minFilter = LinearFilter;

    // const shader = ShaderLib.equirect;
    // const shaderMat = new ShaderMaterial({
    //   fragmentShader: shader.fragmentShader,
    //   vertexShader: shader.vertexShader,
    //   uniforms: shader.uniforms,
    //   depthWrite: false,
    //   side: BackSide
    // });

    // shaderMat.uniforms.tEquirect.value = texture;

    // const plane = new BoxBufferGeometry(1000000000, 1000000000, 1000000000);
    // sky = new Mesh(plane, shaderMat);
    // scene.add(sky);

    return scene;
}