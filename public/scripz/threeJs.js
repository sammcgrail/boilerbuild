const visualMainElement = document.querySelector('main');
const visualValueCount = 16;
let visualElements;
const emojiPaths = [
    '/laugh.png',
    '/cool.png',
    '/pro.png',
    '/angery.png',
    '/gotheat.png',
];
let emojis = [];
let lamberts = [];

const makeOpaqueMaterial = (texture) => {
    return new THREE.MeshLambertMaterial({
        map: texture,
        transparent: false,
    });
};

const makeColorMaterial = (colorString) => {
    return new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorString).getHex(),
    });
};

const makeLambertMaterial = (texture, opacity) => {
    return new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: opacity,
    });
};

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
        const values = Object.values(data);
        soundValues = values;
    };

    const processError = () => {
        visualMainElement.classList.add('error');
        visualMainElement.innerText =
            'Please allow access to your microphone in order to see this demo.\nNothing bad is going to happen... hopefully :P';
    };

    const a = new AudioVisualizer(audioContext, processFrame, processError);
};

let mouseX;
let mouseY;
let vec = new THREE.Vector3();
let pos = new THREE.Vector3();
const worldSize = 1000;

const defaultPizzaLoc = new THREE.Vector3(0, 0, 0);

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.rotation.x = -0.6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const hemiLight = new THREE.HemisphereLight(
    new THREE.Color('white').getHex(),
    new THREE.Color('white').getHex(),
    0.9
);
const pointLight = new THREE.PointLight(0xffffff, 4, 100);
const spotLightRed = new THREE.SpotLight(0);
pointLight.position.set(0, 0, 2);
scene.add(hemiLight);
scene.add(pointLight);

const up = 38;
const down = 40;

const keysCurrentlyPressed = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
};

document.onkeydown = (event) => {
    keysCurrentlyPressed[event.key] = true;
};

document.onkeyup = (event) => {
    keysCurrentlyPressed[event.key] = false;
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

const makePlayer = (texture) => {
    const topBox = makePhysicsCube({
        texture,
        position: [0, 4, 0],
        sideSize: 1,
        bounciness: 0.2,
        density: 1,
        friction: 0.02,
        isDynamic: true,
        name: 'playerTop',
    });
    const bottomBox = makePhysicsCube({
        texture,
        position: [0, 1, 0],
        sideSize: 2,
        bounciness: 0.2,
        density: 10,
        friction: 0.02,
        isDynamic: true,
        name: 'playerBot',
    });
    world.add({
        type: 'jointHinge',
        body1: 'playerTop',
        body2: 'playerBot',
        min: 2,
        max: 2,
        pos1: [0, -0.5, 0],
        pos2: [0, 1, 0],
        axe1: [0, 1, 0],
        axe2: [0, 1, 0],
    });
    return [topBox, bottomBox];
};

const makegroup = () => {
    const group = new THREE.Group();
    const material = makeColorMaterial('blue');
    for (let i = 0; i < worldSize; ++i) {
        const pointsX = [];
        pointsX.push(new THREE.Vector3(i - worldSize / 2, -5, -worldSize / 2));
        pointsX.push(new THREE.Vector3(i - worldSize / 2, -5, worldSize / 2));
        const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);

        const pointsY = [];
        pointsY.push(new THREE.Vector3(-worldSize / 2, -5, worldSize / 2 - i));
        pointsY.push(new THREE.Vector3(worldSize / 2, -5, worldSize / 2 - i));
        const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);

        const lineX = new THREE.Line(geometryX, material);
        const lineY = new THREE.Line(geometryY, material);
        group.add(lineX);
        group.add(lineY);
    }
    return group;
};

const makeGrid = () => {
    scene.add(makegroup());
    const wall1 = makegroup();
    wall1.rotation.z = Math.PI / 2;
    wall1.position.x = 15.2;
    wall1.position.y = worldSize / 2;
    scene.add(wall1);

    const wall2 = makegroup();
    wall2.rotation.z = Math.PI / 2;
    wall2.position.x = -15.2;
    wall2.position.y = worldSize / 2;
    scene.add(wall2);
};

const makeASphere = (texture) => {
    const material = makeOpaqueMaterial(texture);
    const geometry = new THREE.SphereGeometry(0.5, 32, 16);
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    return sphere;
};

const makeACube = (texture, sideSize) => {
    const material = makeOpaqueMaterial(texture);
    const geometry = new THREE.BoxGeometry(sideSize, sideSize, sideSize);
    const cube = new THREE.Mesh(geometry, material);
    cube.maxFrames = Math.floor(Math.random() * 300);
    scene.add(cube);
    return cube;
};

const makeAPizza = (texture) => {
    const material = makeOpaqueMaterial(texture);
    const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);
    return cylinder;
};

const makePhysicsCube = ({
    texture,
    position,
    sideSize,
    bounciness,
    density,
    friction,
    isDynamic,
    name,
}) => {
    const cube = makeACube(texture, sideSize);
    const physicsGeometry = world.add({
        type: 'box',
        size: [sideSize, sideSize, sideSize],
        pos: position,
        move: isDynamic,
        density: density,
        friction: friction,
        belongsTo: 1,
        restitution: bounciness,
        name: name,
    });
    cube.physics = physicsGeometry;
    return cube;
};

const makePhysicsPizza = (
    texture,
    position,
    diameter = 1,
    depth = 0.2,
    isDynamic = true,
    bouncinessRange = 3
) => {
    const pizza = makeAPizza(texture);
    const physicsGeometry = world.add({
        type: 'cylinder',
        size: [diameter, depth, diameter],
        pos: position,
        move: isDynamic,
        density: 1,
        friction: 3,
        belongsTo: 1,
        restitution: Math.random() * bouncinessRange,
    });
    pizza.physics = physicsGeometry;
    return pizza;
};

const makeBackdropWithTexture = (texture) => {
    const material = makeLambertMaterial(texture, 0.8);
    const geometry = new THREE.BoxGeometry(32, 32, 32);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = -300;
    scene.add(plane);
    return plane;
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

globalEventBus = createNanoEvents();

let axis = new THREE.Vector3(0, 1, 0);
var pointing = new THREE.Vector3(0, 0, 0);
var cameraGimble = new THREE.Vector3(0, 10, 10);

const animate = (backdrop, physicsShapes, texture) => {
    requestAnimationFrame(() => animate(backdrop, physicsShapes, texture));

    camera.getWorldDirection(pointing);

    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 10;
    camera.position.z = player.position.z + 10;

    // Takes radians
    function moveInDirection(movementVector) {
        player.physics.applyImpulse(
            new OIMO.Vec3(0, 0, 0),
            movementVector.multiplyScalar(8)
        );
    }

    function rotatePlayer(rotationDirection) {}

    //jump
    if (keysCurrentlyPressed[' ']) {
        if (player.physics.position.y < 0) {
            const force = new OIMO.Vec3(0, 1, 0);
            player.physics.applyImpulse(
                new OIMO.Vec3(0, 0, 0),
                force.multiplyScalar(100)
            );
        }
    }

    // go forward
    if (keysCurrentlyPressed.w) {
        moveInDirection(new OIMO.Vec3(0, 0, -1));
    }
    // go backward
    if (keysCurrentlyPressed.s) {
        moveInDirection(new OIMO.Vec3(0, 0, 1));
    }
    // // rotate left
    if (keysCurrentlyPressed.a) {
        moveInDirection(new OIMO.Vec3(-1, 0, 0));
    }
    // rotate right
    if (keysCurrentlyPressed.d) {
        moveInDirection(new OIMO.Vec3(1, 0, 0));
    }

    frames++;

    if (frames % 60 === 0) {
        const num = Math.floor(Math.random()*(emojis.length));
        for(let i = 0; i < 10; i++) {
            physicsShapes.push(
                makePhysicsPizza(emojis[(num+i)%(emojis.length)], [0, 5, -i*3], 1, 0.2, true, 3)
            )
        }
        // physicsShapes.push(
        //     makePhysicsPizza(emojis[num], [defaultPizzaLoc], 1, 0.2, true, 3)
        // );
        // physicsShapes.push(
        //     makePhysicsPizza(emojis[num], [10, 10, -10], 1, 0.2, true, 3)
        // );
        backdrop.material = lamberts[num];
    }

    pointLight.intensity = 1 / 2000;

    backdrop.rotation.y = (frames / 155) % 180;
    backdrop.rotation.x = (frames / 155) % 180;

    physicsShapes.forEach((shape, i) => {
        shape.position.copy(shape.physics.getPosition());
        shape.quaternion.copy(shape.physics.getQuaternion());
    });
    world.step();
    renderer.render(scene, camera);
};

let player = undefined;

Promise.all(
    emojiPaths.map(async (path) => {
        return await loader.loadAsync(path);
    })
).then((e) => {
    emojis = e;
    lamberts = e.map((texture) => {
        return makeLambertMaterial(texture, 0.8)
    });
    world.add({
        type: 'box',
        size: [worldSize, 0.5, worldSize],
        pos: [0, -5.2, 0],
        move: false,
        density: 1,
        friction: 3,
        belongsTo: 1,
    });
    world.add({
        type: 'box',
        size: [1, worldSize, worldSize],
        pos: [15.2, 0, 0],
        move: false,
        density: 1,
        friction: 3,
        belongsTo: 1,
    });
    world.add({
        type: 'box',
        size: [1, worldSize, worldSize],
        pos: [-15.2, 0, 0],
        move: false,
        density: 1,
        friction: 3,
        belongsTo: 1,
    });
    world.add({
        type: 'box',
        size: [worldSize, worldSize, 1],
        pos: [0, 0, 15.2],
        move: false,
        density: 1,
        friction: 3,
        belongsTo: 1,
    });
    world.add({
        type: 'box',
        size: [worldSize, worldSize, 1],
        pos: [0, 0, -15.2],
        move: false,
        density: 1,
        friction: 3,
        belongsTo: 1,
    });
    makeGrid();
    const backdrop = makeBackdropWithTexture(emojis[2]);
    const players = makePlayer(emojis[2]);
    player = players[1];
    animate(backdrop, [...players], emojis[3]);
});

// Add touch events so that touching the screen does the same thing as going forward
document.addEventListener('touchstart', onTouchStart, false);
document.addEventListener('touchmove', onTouchMove, false);
document.addEventListener('touchend', onTouchEnd, false);

let touchStartX = 0;
let touchStartY = 0;

function onTouchStart(event) {
    if (event.touches.length === 1) { // Only deal with one finger
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        keysCurrentlyPressed['w'] = true; // Start moving forward on touch
    }
}

function onTouchMove(event) {
    if (event.touches.length === 1) { // Only deal with one finger
        const touch = event.touches[0];
        const touchMoveX = touch.clientX;
        const touchMoveY = touch.clientY;

        const deltaX = touchMoveX - touchStartX;
        const deltaY = touchMoveY - touchStartY;

        // You can add more conditions here to handle touch move
        // For example, checking for swipes to the left or right, etc.
    }
}

function onTouchEnd(event) {
    keysCurrentlyPressed['w'] = false; // Stop moving forward when touch ends
}
