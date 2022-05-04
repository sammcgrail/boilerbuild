const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();

const makeACube = (material) => {
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const light = new THREE.HemisphereLight(0xf6e86d, 0x404040, 0.5);

let frames = 0;
const animate = (cubes) => {
    requestAnimationFrame(() => animate(cubes));
    frames++;
    cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        if(frames % 30 === 0){
            cube.position.x = Math.random() * 10;
            cube.position.y = Math.random() * 10;
        }
    })
    
    renderer.render(scene, camera);
}

loader.load(
    'https://cdn.vox-cdn.com/thumbor/KCM3M4hs7f01BCOspPDVmi7z0hw=/0x0:1024x683/1200x900/filters:focal(431x261:593x423)/cdn.vox-cdn.com/uploads/chorus_image/image/55950361/6777933006_1a4f5489d4_b.0.6.jpg',
    function (texture) {
        const material = new THREE.MeshBasicMaterial({
            map: texture
        })
        const cubes = [];
        for (let i = 0; i < 100; i++) {
            const cube = makeACube(material);
            cube.position.x = i * 0.05;
            cube.position.y = i * 0.05;
            cubes.push(cube);
        }
        console.log(cubes, scene);
        animate(cubes);
    },
    undefined,
    function (err) {
        console.error("haha fuck y")
    }
)

scene.add(light);

camera.position.z = 5;
