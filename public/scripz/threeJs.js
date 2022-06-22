const visualMainElement = document.querySelector('main');
const visualValueCount = 16;
let visualElements;

// notes
// Visuals of pizza cube at first are possibly aesthetically displeasing, possibly change to dark brown? get some char
// consider varying pizza velocity

// - top management

// texture

// or game

// TODO
// bulldozer object to sweep the pizz
// gimbled camera behind bulldyd
// push them za

// size of "collector" changes on amount of suck
// socket?

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
for (let i = 0; i < 16; i++) {
    soundValues.push(0);
}

const world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2,
    worldscale: 1,
    gravity: [0, -9.8, 0],
});

const init = () => {
    // Creating initial DOM elements
    const audioContext = new AudioContext();
    const initDOM = () => {
        visualMainElement.innerHTML = '';
        createDOMElements();
    };
    initDOM();

    // Swapping values around for a better visual effect
    const dataMap = {
        0: 15,
        1: 10,
        2: 8,
        3: 9,
        4: 6,
        5: 5,
        6: 2,
        7: 1,
        8: 0,
        9: 4,
        10: 3,
        11: 7,
        12: 11,
        13: 12,
        14: 13,
        15: 14,
    };
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
        visualMainElement.innerText =
            'Please allow access to your microphone in order to see this demo.\nNothing bad is going to happen... hopefully :P';
    };

    const a = new AudioVisualizer(audioContext, processFrame, processError);
};
// init();

let mouseX;
let mouseY;
let vec = new THREE.Vector3();
let pos = new THREE.Vector3();

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const hemiLight = new THREE.HemisphereLight(
    new THREE.Color('orange').getHex(),
    new THREE.Color('blue').getHex(),
    0.9
);
const pointLight = new THREE.PointLight(0xffffff, 4, 100);
const spotLightRed = new THREE.SpotLight(0);
pointLight.position.set(0, 0, 2);
scene.add(hemiLight);
scene.add(pointLight);

let expansionX = 0;
let expansionY = 0;

document.onmousedown = () => {
    expansionX += 100;
};
const up = 38;
const down = 40;
document.onkeyup = (event) => {
    if (event.keyCode === up) {
        expansionX += 100;
    } else if (event.keyCode === down) {
        if (expansionX > 100) {
            expansionX -= 100;
        }
    }
};

document.body.appendChild(renderer.domElement);

document.onmousemove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    vec.set(
        (mouseX / window.innerWidth) * 2 - 1,
        -(mouseY / window.innerHeight) * 2 + 1,
        0.5
    );
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    const distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
};

const createGrid = () => {
    const colorMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color('blue').getHex(),
    });
    for (let i = 0; i < 100; ++i) {
        const pointsX = [];
        pointsX.push(new THREE.Vector3(i - 50, -5, -50));
        pointsX.push(new THREE.Vector3(i - 50, -5, 50));
        const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);

        const pointsY = [];
        pointsY.push(new THREE.Vector3(-50, -5, 50 - i));
        pointsY.push(new THREE.Vector3(50, -5, 50 - i));
        const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);

        const lineX = new THREE.Line(geometryX, colorMaterial);
        const lineY = new THREE.Line(geometryY, colorMaterial);
        scene.add(lineX);
        scene.add(lineY);
    }
};

const makeASphere = (texture) => {
    const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
    });
    const opaqueMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
    });
    const geometry = new THREE.SphereGeometry(0.5, 32, 16);
    const sphere = new THREE.Mesh(geometry, opaqueMaterial);
    scene.add(sphere);
    return sphere;
};

const makeACube = (texture) => {
    const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
    });
    const opaqueMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
    });
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, opaqueMaterial);
    cube.maxFrames = Math.floor(Math.random() * 300);
    scene.add(cube);
    return cube;
};

const makeAPizza = (texture) => {
    const opaqueMaterial = new THREE.MeshLambertMaterial({
        map: texture,
    });
    const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    const cylinder = new THREE.Mesh(geometry, opaqueMaterial);
    scene.add(cylinder);
    return cylinder;
};

const makePhysicsCube = (texture, xPos, isDynamic = true) => {
    const cube = makeACube(texture);
    const physicsGeometry = world.add({
        type: 'box',
        size: [1, 1, 1],
        pos: [xPos, 0, 0],
        move: isDynamic,
        density: 1,
        friction: 10,
        belongsTo: 1,
        restitution: Math.random() * 3,
    });
    cube.physics = physicsGeometry;
    return cube;
};

const makePhysicsPizza = (texture, pos, isDynamic = true) => {
    const pizza = makeAPizza(texture);
    const physicsGeometry = world.add({
        type: 'cylinder',
        size: [1, 0.2, 1],
        pos: pos,
        move: isDynamic,
        density: 1,
        friction: 3,
        belongsTo: 1,
        restitution: Math.random() * 3,
    });
    pizza.physics = physicsGeometry;
    return pizza;
};

const makeBackdropWithTexture = (texture) => {
    const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
    });
    const geometry = new THREE.BoxGeometry(32, 32, 32);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = -300;
    scene.add(plane);
    return plane;
};

const makeCubesWithTexture = (texture) => {
    const cubes = [];
    for (let i = 0; i < 10; i++) {
        let cube;
        if (i === 0) {
            cube = makePhysicsCube(texture, false);
        } else {
            cube = makePhysicsCube(texture, false);
        }
        cube.position.x = 0;
        cube.position.y = 0;
        cubes.push(cube);
    }
    return cubes;
};

const makeSpheresWithTexture = (texture) => {
    const spheres = [];
    for (let i = 0; i < 10; i++) {
        let sphere;
        sphere = makeASphere(texture);
        sphere.position.x = 0;
        sphere.position.y = 0;
        spheres.push(sphere);
    }
    return spheres;
};

const curves = () => {
    const curve = new THREE.QuadraticBezierCurve(
        new THREE.Vector2(-2, -5),
        new THREE.Vector2(-0.5, 2),
        new THREE.Vector2(-2, 2),
        new THREE.Vector2(2, 4),
        new THREE.Vector2(2, 3)
    );
    const points = curve.getPoints(150);
    return points;
};

const line = curves();

let frames = 0;
const dataMap = {
    0: 15,
    1: 10,
    2: 8,
    3: 9,
    4: 6,
    5: 5,
    6: 2,
    7: 1,
    8: 0,
    9: 4,
    10: 3,
    11: 7,
    12: 11,
    13: 12,
    14: 13,
    15: 14,
};
const animate = (shapes, backdrop, physicsShapes, texture) => {
    requestAnimationFrame(() =>
        animate(shapes, backdrop, physicsShapes, texture)
    );
    if (expansionX > 0) {
        expansionX -= expansionX * 0.05;
    }
    if (expansionY > 0) {
        expansionY -= expansionY * 0.01;
    }
    frames++;
    const magicX = (soundValues[0] / 255) * 10;
    const magicY = (soundValues[1] / 255) * 10;

    // console.log(backdrop.position);
    if (frames % 60 === 0) {
        physicsShapes.push(
            makePhysicsPizza(
                texture,
                [camera.position.x, camera.position.y - 1, 0],
                Math.random() * 2 - 1
            )
        );
    }

    expansionX += magicX;
    expansionY += magicY;
    pointLight.intensity = expansionX / 2000;
    // const sizeVector = new THREE.Vector3(expansionX / 255, expansionY / 255, 10);
    const sizeVector = { x: expansionX / 255, y: expansionY / 255, z: 1 };
    // console.log(sizeVector);
    // console.log(shapes[0]);
    backdrop.rotation.y = (frames / 155) % 180;
    backdrop.rotation.x = (frames / 155) % 180;
    // backdrop.position.z = -400 / magicX;
    expansionX = _.clamp(expansionX, 30, 355);
    expansionY = _.clamp(expansionY, 30, 355);

    shapes.forEach((shape, i) => {
        // console.log(shape);
        if (i !== 0) shape.material.opacity = (expansionX * i) / 255;
        // console.log(soundValues)
        shape.scale.set(expansionX / 255, expansionX / 255, expansionX / 255);
        // shape.rotation.x += 0.01;
        // shape.rotation.y += 0.01;
        // if(frames % shape.maxFrames === 0){
        //     shape.position.x = -5 + Math.random() * 10;
        //     shape.position.y = -5 + Math.random() * 10;
        // }
        // shape.position.x = line[(frames + i) % line.length].x + line[i].x;
        // shape.position.y = line[(frames + i) % line.length].y + line[i].y;
        // shape.position.z = -i * 0.5 + line[i].x * line[i].y; neat z-view trick
        shape.position.x =
            pos.x + Math.sin(frames / 60 + i) * (expansionX / 100);
        shape.position.y =
            pos.y + Math.cos(frames / 60 + i) * (expansionY / 100);
        shape.physics.setPosition(shape.position);
        // shape.position.z = -i + 6; don't do this
    });
    physicsShapes.forEach((shape, i) => {
        shape.position.copy(shape.physics.getPosition());
        shape.quaternion.copy(shape.physics.getQuaternion());
    });
    // camera.position.y = Math.sin(frames / 180);
    // camera.position.x = Math.cos(frames / 180);
    world.step();
    renderer.render(scene, camera);
};

loader.load(
    '/pizza.png',
    (texture) => {
        world.add({
            type: 'box',
            size: [100, 0.5, 100],
            pos: [0, -5.2, 0],
            move: false,
            density: 1,
            friction: 3,
            belongsTo: 1,
        });
        createGrid();
        const cubes = makeCubesWithTexture(texture);
        // const spheres = makeSpheresWithTexture(texture);
        const backdrop = makeBackdropWithTexture(texture);
        const physicsShapes = () => {
            return [makePhysicsCube(texture)];
        };
        animate(cubes, backdrop, physicsShapes(), texture);
    },
    undefined,
    function (err) {
        console.error('haha fuck y');
    }
);
