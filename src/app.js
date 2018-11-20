const Shake = require('shake.js');
const ElfWorld = require('./elfworld');

const elfWorld = new ElfWorld();
const shakeEvent = new Shake({ threshold: 10, timeout: 1000 });


window.addEventListener('load', () => {
  elfWorld.init();
  shakeEvent.start();
});

window.addEventListener('orientationchange', elfWorld.updateGravity.bind(elfWorld));
window.addEventListener('deviceorientation', elfWorld.updateGravity.bind(elfWorld), true);
window.addEventListener('shake', elfWorld.randomImpulse.bind(elfWorld), false);
