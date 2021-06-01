import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import dat from'dat.gui';

/*
*   Listeners
*/
window.addEventListener('resize', onWindowResize);

const parameters = {
  redColor: '#cc0101'
}



// region Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

 
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true
// endregion




const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1515515);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.set(0, 10, 20);
camera.lookAt(0, 5, 0);

renderer.render(scene, camera);


// axis helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const centerLight = new THREE.PointLight(0xffffff)
const centerLightHelper = new THREE.PointLightHelper(centerLight, 1, '#cc0101')
centerLight.position.set(0, 5, 0)
// centerLight.distance = 50
centerLight.power = 12
// centerLight.intensity = 300
// centerLight.decay = 0.1
// centerLight.castShadow = true
// centerLight.shadow.mapSize.width = 512; // default
// centerLight.shadow.mapSize.height = 512; // default
// centerLight.shadow.camera.near = 0.5; // default
// centerLight.shadow.camera.far = 500; // default
// scene.add(centerLight, centerLightHelper)


const rectAreaLight = new THREE.RectAreaLight(0xffffff, 50, 3, 1)
rectAreaLight.position.set( 20, 2, -34)

scene.add(rectAreaLight)



//
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );


// region controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
// endregion

// region Textures

const textureLoader = new THREE.TextureLoader()
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {

}
loadingManager.onProgress = () => {

}
loadingManager.onLoaded = () => {

}
loadingManager.onError = () => {

}

// const texture = textureLoader.load('textures/marble.jpg')
const matcapTexture = textureLoader.load('textures/white.png')

// endregion

// region Fonts

const fontLoader = new THREE.FontLoader()
fontLoader.load('fonts/FrenchCanonItalic.json',
    (font) => {
      const textGeometry = new THREE.TextBufferGeometry(
          'M.K.3',
          {
            font,
            size: 1,
            height: 0.4,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0,
            bevelSegments: 5
          }
      )
      textGeometry.computeBoundingBox()
      textGeometry.center()
      const textMaterial = new THREE.MeshMatcapMaterial( { matcap: matcapTexture } )
      const text = new THREE.Mesh(textGeometry, textMaterial)
      text.position.set(0, 6, 0)
      scene.add(text)
    },
    () => console.log('loading'),
    () => console.log('error')
)

// endregion



const roomGroup = new THREE.Group()

const roomMaterial = new THREE.MeshStandardMaterial( '#fffff' )
roomMaterial.shininess = 100
roomMaterial.metalness = 0.7
roomMaterial.roughness = 0.2

// roomMaterial.specular = new THREE.Color()
// roomMaterial.reflectivity = 1
// roomMaterial.side = THREE.DoubleSide

const roomFloorGeometry = new THREE.PlaneBufferGeometry(50, 75, 1)
const roomFloorMesh = new THREE.Mesh(roomFloorGeometry, roomMaterial)
// roomFloorMesh.recieveShadow = true
roomFloorMesh.rotateX(-Math.PI / 2);

const roomCeilingGeometry = new THREE.PlaneBufferGeometry(50, 75, 1)
const roomCeilingMesh = new THREE.Mesh(roomCeilingGeometry, roomMaterial)
roomCeilingMesh.position.set(0, 20, 0)
roomCeilingMesh.rotateX(Math.PI / 2);


const roomWallGeometry = new THREE.PlaneBufferGeometry(75, 20, 1)
roomWallGeometry.rotateY(Math.PI/2)

const roomWallMesh = new THREE.Mesh(roomWallGeometry, roomMaterial)
roomWallMesh.position.set(roomFloorGeometry.parameters.width / 2, roomWallGeometry.parameters.height / 2, 0)
roomWallMesh.rotateY(Math.PI)

const roomWallMesh2 = new THREE.Mesh(roomWallGeometry, roomMaterial)
roomWallMesh2.position.set(-(roomFloorGeometry.parameters.width / 2), roomWallGeometry.parameters.height / 2, 0)


const roomFrontWallGeometry = new THREE.PlaneBufferGeometry(50, 20, 1)
const roomFrontWallMesh = new THREE.Mesh(roomFrontWallGeometry, roomMaterial)
roomFrontWallMesh.position.set(0, roomFrontWallGeometry.parameters.height / 2, -(roomFloorGeometry.parameters.width / 2))


// backWall logo lights splitter
const lightsSplitterWallGeometry = new THREE.BoxGeometry(Math.sqrt((50 ** 2) + (20 ** 2)), 3, 10)
const lightsSplitterWallMesh = new THREE.Mesh(lightsSplitterWallGeometry, roomMaterial)
lightsSplitterWallMesh.position.set(0, roomWallGeometry.parameters.height / 2, -((roomFloorGeometry.parameters.depth / 2) - 1))
lightsSplitterWallMesh.rotateZ(Math.tan((roomWallGeometry.parameters.height / 2) / (roomCeilingGeometry.parameters.width / 2)))
lightsSplitterWallMesh.receiveShadow = true

// backwall for logo
const roomFrontInsideWallGeometry = new THREE.BoxGeometry(49, 19, 1)
const roomFrontInsideWallMesh = new THREE.Mesh(roomFrontInsideWallGeometry, roomMaterial)
roomFrontInsideWallMesh.position.set(0, roomWallGeometry.parameters.height / 2, -((roomFloorGeometry.parameters.depth / 2) - 3))
roomFrontInsideWallMesh.receiveShadow = true;
scene.add(roomFrontInsideWallMesh)

roomGroup.add(roomFloorMesh, roomWallMesh, roomWallMesh2, roomFrontWallMesh, roomCeilingMesh, lightsSplitterWallMesh,
)
roomGroup.castShadow = false; //default is false
roomGroup.receiveShadow = true; //default

// lights for room
const redLight = new THREE.PointLight('#cc0101')
redLight.position.set(-21, 16, -36.5)
const blueLightHelper = new THREE.PointLightHelper(redLight, 1, '#009bff')
// scene.add(redLight, blueLightHelper)

const blueLight = new THREE.PointLight('#0101cc')
blueLight.position.set(21, 4, -36.5)
const redLightHelper = new THREE.PointLightHelper(blueLight, 1, '#009bff')
let lights = [redLight, blueLight]
lights.forEach(light => {
  light.distance = 50
  light.power = 300
  light.castShadow = true
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default
  //Create a helper for the shadow camera (optional)
  // const helper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add(helper);
})

// scene.add(blueLight, redLightHelper)
scene.add(roomGroup)



// region GUI Debug
const gui = new dat.GUI()

gui.add(centerLight, 'power' ).min(-10).max(20).step(0.01)

gui.addColor(parameters, 'redColor').onChange( () => {
    centerLight.color.set(parameters.redColor)
})

gui.add(roomMaterial, 'shininess').min(0).max(200).step(1)
gui.add(roomMaterial, 'metalness').min(0).max(1).step(0.01)
gui.add(roomMaterial, 'roughness').min(0).max(1).step(0.01)


gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)
//.set
const RecLight = gui.addFolder("Rectangle Light")
RecLight.add(rectAreaLight.position, 'x', -50, 50, 1)
RecLight.add(rectAreaLight.position, 'y', -50, 50, 1)
RecLight.add(rectAreaLight.position, 'z', -50, 50, 1)
// endregion







// region RenderLoop
const clock = new THREE.Clock()

function animate() {

  //
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.0001;
  // torus.rotation.z += 0.01;
  const elapsedTime = clock.getElapsedTime()
  // blueLight.target.updateMatrixWorld();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

}

animate();
// endregion

// region Helper Functions
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) )
  renderer.setSize( window.innerWidth, window.innerHeight );

}

// endregion
