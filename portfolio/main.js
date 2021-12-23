import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight ); 
camera.position.setZ(30);

//const controls = new OrbitControls(camera, renderer.domElement);

/*
------------
| GEOMETRY |
------------
*/

//const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
//const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );
//const torus = new THREE.Mesh( geometry, material );

//scene.add(torus)
const planeGeometry = new THREE.PlaneGeometry( 400, 400, 100, 100 );
const planeMaterial = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true } );
const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial)
scene.add(planeMesh)

const {array} = planeMesh.geometry.attributes.position
for (let i = 0; i < array.length; i += 3) {
  const x = array[i]
  const y = array[i + 1]
  const z = array[i + 2]

  array[i + 2] = z + Math.random()
}

const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0, 0)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(-40,0,20)
//const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(directionalLight)


/*
-----------
| HELPERS |
-----------
*/

//SHOWS LIGHT POSITIONS:
//const lightHelper = new THREE.PointLightHelper(directionalLight)
//scene.add(lightHelper)

//SHOWS GRID POSITIONS:
//const gridHelper = new THREE.GridHelper(200, 50)
//scene.add(gridHelper)

/*
-----------------
| CUSTOM MODELS |
-----------------
*/
/*
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
);*/

/*
-------------
| FUNCTIONS |
-------------
*/
/*
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 500 ))

  star.position.set(x, y, z);
  scene.add(star)
}
Array(200).fill().forEach(addStar)*/

const mouse = {
  x: undefined,
  y: undefined
}

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth)*2-1
  mouse.y = -(event.clientY / innerHeight)*2+1
})

function animate() {
  requestAnimationFrame( animate );

  //torus.rotation.x += 0.01;

  //controls.update();

  renderer.render( scene, camera );
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes

    color.setX(intersects[0].face.a, 0.6)
    color.setY(intersects[0].face.a, 0.6)
    color.setZ(intersects[0].face.a, 0.6)

    color.setX(intersects[0].face.b, 0.6)
    color.setY(intersects[0].face.b, 0.6)
    color.setZ(intersects[0].face.b, 0.6)

    color.setX(intersects[0].face.c, 0.6)
    color.setY(intersects[0].face.c, 0.6)
    color.setZ(intersects[0].face.c, 0.6)

    color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0,
      b: 0
    }

    const hoverColor = {
      r: 0.6,
      g: 0.6,
      b: 0.6
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })
  }
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

animate()
window.addEventListener( 'resize', onWindowResize );

