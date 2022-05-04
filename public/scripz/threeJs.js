const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();

const makeACube = (material) => {
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    cube.maxFrames = Math.floor(Math.random() * 300);
    scene.add(cube);
    return cube;
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const light = new THREE.HemisphereLight(0xf6e86d, 0x404040, 0.5);

const curves = () => {
    const curve = new THREE.QuadraticBezierCurve(
        new THREE.Vector2(-2, -5),
        new THREE.Vector2(-0.5, 2),
        new THREE.Vector2(-2, 2),
        new THREE.Vector2(2, 4),
        new THREE.Vector2(2, 3)
    );
    const points = curve.getPoints(100);
    return points;
}

const line = curves();
let mouseX;
let mouseY;
let vec = new THREE.Vector3();
let pos = new THREE.Vector3();
document.onmousemove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    vec.set(
        (mouseX / window.innerWidth) * 2 - 1,
        -(mouseY / window.innerHeight) * 2 + 1,
        0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    const distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
}

let frames = 0;
const animate = (cubes) => {
    requestAnimationFrame(() => animate(cubes));
    frames++;
    cubes.forEach((cube, i) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        // if(frames % cube.maxFrames === 0){
        //     cube.position.x = -5 + Math.random() * 10;
        //     cube.position.y = -5 + Math.random() * 10;
        // }
        // cube.position.x = line[(frames + i) % line.length].x + line[i].x;
        // cube.position.y = line[(frames + i) % line.length].y + line[i].y;
        // cube.position.z = -i * 0.5 + line[i].x * line[i].y; neat z-view trick
        cube.position.x = pos.x + Math.sin(frames + i);
        cube.position.y = pos.y + Math.cos(frames + i); 
        // cube.position.z = -i + 6; don't do this
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
            cube.position.x = line[i].x;
            cube.position.y = line[i].y;
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
