import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import dat from 'dat.gui';
import gsap from 'gsap'
import Stats from 'stats.js'


const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


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

camera.position.set(3, 3, 3);
camera.lookAt(new THREE.Vector3(-4, 4, 0));
camera.updateProjectionMatrix()
scene.add(camera)
renderer.render(scene, camera);


// axis helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const centerLight = new THREE.PointLight(0xffffff)
const centerLightHelper = new THREE.PointLightHelper(centerLight, 1, '#cc0101')
centerLight.position.set(0, 5, 0)
centerLight.distance = 50
centerLight.power = 12
centerLight.intensity = 0.5
centerLight.decay = 0.1
centerLight.castShadow = true
// centerLight.shadow.mapSize.width = 512; // default
// centerLight.shadow.mapSize.height = 512; // default
// centerLight.shadow.camera.near = 0.5; // default
// centerLight.shadow.camera.far = 500; // default
scene.add(centerLight, centerLightHelper)


//
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);


// region controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.minDistance = (3)
controls.maxDistance = (5)
controls.target.set(0, 2, 0)
// controls.minPolarAngle = -Math.PI/2
controls.maxPolarAngle = Math.PI / 2.1
// controls.enablePan = false
// controls.autoRotate = true
controls.rotateSpeed = 0.5

// endregion

// region Textures

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log('started')
}
loadingManager.onProgress = () => {

}
loadingManager.onLoad = () => {
    updateTextures()
}
loadingManager.onError = () => {
    console.log('err')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
// const texture = textureLoader.load('textures/marble.jpg')
// const matcapTexture = textureLoader.load('textures/white.png')

const marbleTexture = textureLoader.load('textures/white.png')

// walls
const wallStoneBaseColorTexture = textureLoader.load('textures/wall_stone/Wall_Stone_020_basecolor.jpg')
const wallStoneNormalTexture = textureLoader.load('textures/wall_stone/Wall_Stone_020_normal.jpg')
const wallStoneRoughnessTexture = textureLoader.load('textures/wall_stone/Wall_Stone_020_roughness.jpg')
const wallStoneAmbientOcclusionTexture = textureLoader.load('textures/wall_stone/Wall_Stone_020_ambientOcclusion.jpg')
const wallStoneDisplacementTexture = textureLoader.load('textures/wall_stone/Wall_Stone_020_height.png')

// floor
const marbleTilesBaseColorTexture = textureLoader.load('textures/marble_tiles/Marble_Tiles_001_basecolor.jpg')
const marbleTilesNormalTexture = textureLoader.load('textures/marble_tiles/Marble_Tiles_001_normal.jpg')
const marbleTilesRoughnessTexture = textureLoader.load('textures/marble_tiles/Marble_Tiles_001_roughness.jpg')
const marbleTilesAmbientOcclusionTexture = textureLoader.load('textures/marble_tiles/Marble_Tiles_001_ambientOcclusion.jpg')
const marbleTilesDisplacementTexture = textureLoader.load('textures/marble_tiles/Marble_Tiles_001_height.png')


// endregion

// region Fonts

// const fontLoader = new THREE.FontLoader()
// fontLoader.load('fonts/FrenchCanonItalic.json',
//     (font) => {
//       const textGeometry = new THREE.TextBufferGeometry(
//           'M.K.3',
//           {
//             font,
//             size: 1,
//             height: 0.4,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 0.03,
//             bevelSize: 0,
//             bevelSegments: 5
//           }
//       )
//       textGeometry.computeBoundingBox()
//       textGeometry.center();
//       // const textMaterial = new THREE.MeshMatcapMaterial( { matcap: matcapTexture } )
//       const textMaterial = new THREE.MeshStandardMaterial( { color: '#fffff' } )
//       const text = new THREE.Mesh(textGeometry, textMaterial)
//       text.position.set(-2, 2, -2);
//       text.rotateY(Math.PI/4)
//       text.castShadow = true
//       scene.add(text)
//     },
//     () => console.log('loading'),
//     () => console.log('error')
// )

// endregion

// region Models

const gltfLoader = new GLTFLoader();

// gltfLoader.load(
//     'mk3.gltf',
//     (mk3logo) => {
//         mk3logo.scene.scale.multiplyScalar(5);
//         scene.add( mk3logo.scene )
//     }
// )
const tableGroup = new THREE.Group()
gltfLoader.load(
    'tlc5.3.gltf',
    (model) => {
        model.scene.scale.divideScalar(25);
        // modelGroup.add( model.scene )
        // model.scene.geom

        model.scene.rotateX(-Math.PI / 2);
        model.scene.position.set(0, 1.501, 0)
        model.scene.translateX(1)
        model.scene.translateY(-1)
        scene.add(model.scene)
        tableGroup.add(model.scene)
    }
)

// endregion

// region Room
/**
 * Main room floor
 */
const roomFloorMaterial = new THREE.MeshPhongMaterial(
    {
        map: marbleTilesBaseColorTexture,
        normalMap: marbleTilesNormalTexture,
        roughnessMap: marbleTilesRoughnessTexture,
        aoMap: marbleTilesAmbientOcclusionTexture,
        displacementMap: marbleTilesDisplacementTexture
    })
roomFloorMaterial.displacementScale = 0.15

const roomFloorGeometry = new THREE.PlaneBufferGeometry(10, 10, 15, 15)
const roomFloor = new THREE.Mesh(roomFloorGeometry, roomFloorMaterial)
roomFloor.receiveShadow = true
roomFloorGeometry.rotateX(-Math.PI / 2)
scene.add(roomFloor)

/**
 * Main room walls
 */
const roomWallMaterial = new THREE.MeshPhongMaterial(
    {
        map: wallStoneBaseColorTexture,
        normalMap: wallStoneNormalTexture,
        roughnessMap: wallStoneRoughnessTexture,
        aoMap: wallStoneAmbientOcclusionTexture,
        displacementMap: wallStoneDisplacementTexture
    })
roomWallMaterial.displacementScale = 0.15
roomWallMaterial.generateMipMaps = false
wallStoneBaseColorTexture.minFilter = THREE.LinearFilter
wallStoneBaseColorTexture.magFilter = THREE.LinearFilter
const roomWallGeometry = new THREE.PlaneBufferGeometry(10, 5, 5, 5)
const roomWall1 = new THREE.Mesh(roomWallGeometry, roomWallMaterial)
roomWall1.position.set(
    roomFloorGeometry.parameters.width / 2,
    roomWallGeometry.parameters.height / 2,
    0
)
roomWall1.rotateY(-Math.PI / 2)
scene.add(roomWall1)

const roomWall2 = new THREE.Mesh(roomWallGeometry, roomWallMaterial)
roomWall2.position.set(
    -roomFloorGeometry.parameters.width / 2,
    roomWallGeometry.parameters.height / 2,
    0
)
roomWall2.rotateY(Math.PI / 2)
scene.add(roomWall2)

const roomWall3 = new THREE.Mesh(roomWallGeometry, roomWallMaterial)
roomWall3.position.set(
    0,
    roomWallGeometry.parameters.height / 2,
    roomFloorGeometry.parameters.width / 2,
)
roomWall3.rotateY(Math.PI)
scene.add(roomWall3)

const roomWall4 = new THREE.Mesh(roomWallGeometry, roomWallMaterial)
roomWall4.position.set(
    0,
    roomWallGeometry.parameters.height / 2,
    -roomFloorGeometry.parameters.width / 2,
)
scene.add(roomWall4)

/**
 * Table where model is placed
 */
const roomTableMaterial = new THREE.MeshPhongMaterial(
    {
        // map: wallStoneBaseColorTexture,
        // normalMap: wallStoneNormalTexture,
        // roughnessMap: wallStoneRoughnessTexture,
        // aoMap: wallStoneAmbientOcclusionTexture,
        // displacementMap: wallStoneDisplacementTexture
    })
const tableGeometry = new THREE.CylinderBufferGeometry(2, 2, 1.5, 16, 1, true,)
const table = new THREE.Mesh(tableGeometry, roomTableMaterial)
table.material.side = THREE.DoubleSide
table.position.set(0, tableGeometry.parameters.height / 2, 0)

const tableFaceGeometry = new THREE.CircleBufferGeometry(2, 16)
const tableFace = new THREE.Mesh(tableFaceGeometry, roomTableMaterial)
tableFace.rotateX(Math.PI / 2)
tableFace.position.set(0, tableGeometry.parameters.height, 0)
tableGroup.add(tableFace, table)
scene.add(tableGroup)
//endregion

//region Projects

let projectsMenuOpened = false

const menuMaterial = new THREE.MeshMatcapMaterial(
    {matcap: marbleTexture})

const projectsMenuGeometry = new THREE.OctahedronBufferGeometry(1, 0)
const projectsMenu = new THREE.Mesh(projectsMenuGeometry, menuMaterial)
projectsMenu.position.setY(2)
projectsMenu.material.transparent = true
projectsMenu.visible = false
scene.add(projectsMenu)

//endregion

//region Animations

const rocketBtn = document.querySelector('#rocket')
rocketBtn.addEventListener('click', onRocketButtonClicked)

function onRocketButtonClicked() {
        // projectsMenu.rotate= (Math.sin(2*Math.PI))
        const from = new THREE.Vector3(0, 6, 0)
        const target = new THREE.Vector3(0, 2, 0)
        const scale = new THREE.Vector3(0.8, 0.8, 0.8)
        const rotation = 10 * Math.PI
    const animateMenu = gsap.timeline();
    animateMenu.fromTo(projectsMenu.material,
        {opacity: 0},
        {opacity: 1, duration: 1},
        0);
    animateMenu.fromTo(projectsMenu.position,
        {y: from.y},
        {y: target.y, duration: 1},
        0);
    animateMenu.fromTo(projectsMenu.rotation,
        {y: 0, duration: 1},
        {y: rotation, duration: 1.2, ease: "elastic.out(1, 0.3)"},
        0)
    animateMenu.fromTo(tableGroup.position,
        {y: 0}, {y: -1, duration: 1},
        0)
    animateMenu.fromTo(tableGroup.scale,
        {x: 1, y: 1, z: 1},
        {x: scale.x, y: scale.y, z: scale.z, duration: 1},
        0)
    if (projectsMenuOpened === false) {
        // projectsMenu.material.opacity = 0.5
       animateMenu.play()
        projectsMenuOpened = true
        projectsMenu.visible = true
    }
    else if (projectsMenuOpened === true) {
        animateMenu.progress(1).reverse()

        setTimeout(() => projectsMenu.visible = false, 1000 )
        projectsMenuOpened = false
    }
}

// document.addEventListener("click", () => {
//   const target = new THREE.Vector3(-2, -4, 0)
//   gsap.to(camera.position, {
//     duration: 1,
//     x: target.x,
//     y: target.y
//   })
//
// })
//endregion

// region GUI Debug
const gui = new dat.GUI()

// gui.add(centerLight, 'power' ).min(-10).max(20).step(0.01)

// gui.addColor(parameters, 'redColor').onChange( () => {
//     centerLight.color.set(parameters.redColor)
// })
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('Ambient Light')

const roomMats = gui.addFolder('Room materials')
// roomMats.add(roomMaterial, 'shininess').min(0).max(200).step(1)
// roomMats.add(roomMaterial, 'metalness').min(0).max(1).step(0.01)
// roomMats.add(roomMaterial, 'roughness').min(0).max(1).step(0.01)

const centerLightGroup = gui.addFolder('centerLight')
centerLightGroup.add(centerLight, 'intensity').min(0).max(1).step(0.001)
centerLightGroup.add(centerLight, 'distance').min(0).max(50).step(1)
centerLightGroup.add(centerLight, 'power').min(0).max(50).step(1)

const roomWalls = roomMats.addFolder('walls material')
roomWalls.add(roomWallMaterial, 'aoMapIntensity').min(0).max(10).step(0.01)
roomWalls.add(roomWallMaterial, 'displacementScale').min(0).max(1).step(0.01)


// endregion


// region RenderLoop
const clock = new THREE.Clock()

function animate() {
    stats.begin();

    // monitored code goes here

    //
    // torus.rotation.x += 0.01;
    // torus.rotation.y += 0.0001;
    // torus.rotation.z += 0.01;
    const elapsedTime = clock.getElapsedTime()
    // blueLight.target.updateMatrixWorld();
    controls.update();
    renderer.render(scene, camera);
    stats.end();

    requestAnimationFrame(animate);

}

animate();
// endregion

// region Helper Functions
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function updateTextures() {
    /**
     * Called after all textures have been loaded
     */

    roomWallMaterial.needsUpdate = true
    roomFloorMaterial.needsUpdate = true
    menuMaterial.needsUpdate = true

}

// endregion
