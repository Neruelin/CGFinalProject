import { Scene, PerspectiveCamera, WebGLRenderer, Color } from 'three';

var scene = new Scene();
var camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new Color( 0x0000ff );

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();