const visualMainElement = document.querySelector('main');
const visualValueCount = 16;
let visualElements;
const createDOMElements = () => {
    let i;
    for (i = 0; i < visualValueCount; ++i) {
        const elm = document.createElement('div');
        visualMainElement.appendChild(elm);
    }

    visualElements = document.querySelectorAll('main div');
};
createDOMElements();

let soundValues = [];
for (let i =0; i < 16; i++) {
    soundValues.push(0);
}

const init = () => {
    // Creating initial DOM elements
    const audioContext = new AudioContext();
    const initDOM = () => {
        visualMainElement.innerHTML = '';
        createDOMElements();
    };
    initDOM();

    // Swapping values around for a better visual effect
    const dataMap = { 0: 15, 1: 10, 2: 8, 3: 9, 4: 6, 5: 5, 6: 2, 7: 1, 8: 0, 9: 4, 10: 3, 11: 7, 12: 11, 13: 12, 14: 13, 15: 14 };
    const processFrame = (data) => {
        // console.log(data);
        const values = Object.values(data);
        soundValues = values;
        // let i;
        // for (i = 0; i < visualValueCount; ++i) {
        //     const value = values[dataMap[i]] / 255;
        //     const elmStyles = visualElements[i].style;
        //     elmStyles.transform = `scaleY( ${value} )`;
        //     elmStyles.opacity = Math.max(.25, value);
        // }
    };

    const processError = () => {
        visualMainElement.classList.add('error');
        visualMainElement.innerText = 'Please allow access to your microphone in order to see this demo.\nNothing bad is going to happen... hopefully :P';
    }

    const a = new AudioVisualizer(audioContext, processFrame, processError);
};
// init();

let mouseX;
let mouseY;
let vec = new THREE.Vector3();
let pos = new THREE.Vector3();

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const light = new THREE.HemisphereLight(0xf6e86d, 0x404040, 0.5);
scene.add(light);

let expansionX = 0;
let expansionY = 0;

document.onmousedown = () => {
    expansionX += 100;
}
const up = 38;
const down = 40;
document.onkeyup = (event) => {
    console.log(event.keyCode);
    if (event.keyCode === up) {
        expansionX += 100;
    } else if (event.keyCode === down) {
        if (expansionX > 100) {
            expansionX -= 100;
        }
    }
}

document.body.appendChild(renderer.domElement);

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



const makeACube = (material) => {
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    cube.maxFrames = Math.floor(Math.random() * 300);
    scene.add(cube);
    return cube;
}

const makeCubesWithTexture = (texture) => {
    const material = new THREE.MeshBasicMaterial({
        map: texture
    })
    const cubes = [];
    for (let i = 0; i < 80; i++) {
        const cube = makeACube(material);
        cube.position.x = 0;
        cube.position.y = 0;
        cubes.push(cube);
    }
    animate(cubes);
}

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

let frames = 0;
const dataMap = { 0: 15, 1: 10, 2: 8, 3: 9, 4: 6, 5: 5, 6: 2, 7: 1, 8: 0, 9: 4, 10: 3, 11: 7, 12: 11, 13: 12, 14: 13, 15: 14 };
const animate = (cubes) => {
    requestAnimationFrame(() => animate(cubes));
    if (expansionX > 0) {
        expansionX -= expansionX * 0.05;
    }
    if (expansionY > 0) {
        expansionY -= expansionY * 0.05;
    }
    frames++;
    const magicX = soundValues[0] / 255 * 10;
    const magicY = soundValues[7] / 255 * 10;

    expansionX += magicX;
    expansionY += magicY;
    
    cubes.forEach((cube, i) => {
        // console.log(soundValues)
        cube.rotation.x = Math.sin(frames + i);
        cube.rotation.y += 0.01;
        // if(frames % cube.maxFrames === 0){
        //     cube.position.x = -5 + Math.random() * 10;
        //     cube.position.y = -5 + Math.random() * 10;
        // }
        // cube.position.x = line[(frames + i) % line.length].x + line[i].x;
        // cube.position.y = line[(frames + i) % line.length].y + line[i].y;
        // cube.position.z = -i * 0.5 + line[i].x * line[i].y; neat z-view trick
        cube.position.x = pos.x + Math.sin(frames + i) * (expansionX / 100);
        cube.position.y = pos.y + Math.cos(frames + i) * (expansionY / 100);
        // cube.position.z = -i + 6; don't do this
    })

    renderer.render(scene, camera);
}

loader.load(
    'https://cdn.vox-cdn.com/thumbor/KCM3M4hs7f01BCOspPDVmi7z0hw=/0x0:1024x683/1200x900/filters:focal(431x261:593x423)/cdn.vox-cdn.com/uploads/chorus_image/image/55950361/6777933006_1a4f5489d4_b.0.6.jpg',
    (texture) => makeCubesWithTexture(texture),
    undefined,
    function (err) {
        console.error("haha fuck y")
    }
)