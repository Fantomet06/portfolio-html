import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight ); 
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );
const torus = new THREE.Mesh( geometry, material );
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0,0,0)
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

/*
-----------
| HELPERS |
-----------
*/

//SHOWS LIGHT POSITIONS:
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

//SHOWS GRID POSITIONS:
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

/*
-----------------
| CUSTOM MODELS |
-----------------
*/

const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderConfig({ type: 'js' });
draco.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
loader.setDRACOLoader( draco );

loader.load('models/scene.gltf', function ( gltf ) {
    gltf.scene.scale.set(0.5,0.5,0.5);
    gltf.scene.position.set(15, -53, -20)
		scene.add( gltf.scene );
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	}
);

/*
-------------
| FUNCTIONS |
-------------
*/

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 500 ))

  star.position.set(x, y, z);
  scene.add(star)
}
Array(200).fill().forEach(addStar)

function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;

  controls.update();

  renderer.render( scene, camera );
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

animate()
window.addEventListener( 'resize', onWindowResize );

