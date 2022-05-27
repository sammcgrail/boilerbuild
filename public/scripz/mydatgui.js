var gui = new dat.GUI({name: 'Pizza Config'});
var folder1 = gui.addFolder('Pizza Size');
var size = {size: 50};
gui.add(size, 'size', 0, 100);
var folder2 = gui.addFolder('Room Lighting');

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 100)