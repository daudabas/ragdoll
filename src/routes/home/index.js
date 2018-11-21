import React from 'react';
import Shake from 'shake.js';
import ElfWorld from './elfworld';
import './index.css';

export default class Game extends React.Component {
  constructor() {
    super();
    console.log('here');
    this.elfWorld = new ElfWorld();
    this.shakeEvent = new Shake({ threshold: 10, timeout: 1000 });

  }

  componentDidMount () {
    this.elfWorld.init();
    this.shakeEvent.start();

    window.addEventListener('orientationchange', this.elfWorld.updateGravity.bind(this.elfWorld));
    window.addEventListener('deviceorientation', this.elfWorld.updateGravity.bind(this.elfWorld), true);
    window.addEventListener('shake', this.elfWorld.randomImpulse.bind(this.elfWorld), false);
  }

  render() {
    return null;
  }
}

