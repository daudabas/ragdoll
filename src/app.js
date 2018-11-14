const ElfWorld = require('./elfworld');

const elfWorld = new ElfWorld();

window.addEventListener('load', () => {
  elfWorld.init();
});

window.addEventListener('orientationchange', elfWorld.updateGravity.bind(elfWorld));
window.addEventListener('deviceorientation', elfWorld.updateGravity.bind(elfWorld), true);
