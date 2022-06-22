var gui = new dat.GUI({ name: 'Pizza Config' });
// var folder1 = gui.addFolder('Pizza Size');
// var size = {size: 50};
// gui.add(size, 'size', 0, 100);
// var folder2 = gui.addFolder('Room Lighting');
// folder2.open();

// const cameraFolder = gui.addFolder('Camera');
// // cameraFolder.add(camera.position, 'x', 0, 100);
// // cameraFolder.add(camera.position, 'y', 0, 100);
// cameraFolder.add(camera.position, 'z', 0, 100);
// cameraFolder.add(plane.position, 'z', 0, 100);
// cameraFolder.open();

// Keep track of keys being pressed
const keysCurrentlyPressed = {};
document.onkeyup = (event) => {
    keysCurrentlyPressed[event.key] = false;
};
document.onkeydown = (event) => {
    keysCurrentlyPressed[event.key] = true;
};

// Camera controls
function aLoop() {}

let loopCounter = 0;
globalEventBus.on('loop', () => {
    loopCounter++;
    // Limit this so it's not fired super fast all the time
    if (loopCounter % 5 === 0) {
        cameraLoop();
    }
});

// const toolz = gui.addFolder('Tools');
// toolz.add(sphere.position, 'x', 0, 100);

// const expansionXslider = gui.addFolder('expando')
// expansionXslider.add(expansionX, 0, 100)
