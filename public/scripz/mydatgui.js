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

// Camera controls
document.onkeydown = (event) => {
    const axis = new THREE.Vector3(0, 1, 0);
    const pointing = camera.getWorldDirection(new THREE.Vector3(0, 0, 0));

    function setDirection(rotationAngle) {
        pointing.applyAxisAngle(axis, rotationAngle);
        camera.position.x += pointing.x;
        camera.position.y += pointing.y;
        camera.position.z += pointing.z;
    }

    switch (event.key) {
        case 'w':
            setDirection(0);
            break;
        case 'a':
            setDirection(Math.PI / 2);
            break;
        case 's':
            setDirection(Math.PI);
            break;
        case 'd':
            setDirection(-Math.PI / 2);
            break;
        // rotate left
        case 'q':
            camera.rotation.y += 0.1;
            break;
        // rotate right
        case 'e':
            camera.rotation.y -= 0.1;
            break;
    }
};

// const toolz = gui.addFolder('Tools');
// toolz.add(sphere.position, 'x', 0, 100);

// const expansionXslider = gui.addFolder('expando')
// expansionXslider.add(expansionX, 0, 100)
