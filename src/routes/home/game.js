import React from 'react';
import Shake from 'shake.js';
import ElfWorld from './elfworld';
import './index.css';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.elfWorld = new ElfWorld(props.headURL);
    this.shakeEvent = new Shake({ threshold: 10, timeout: 1000 });
  }

  start() {
    this.elfWorld.init();
    this.shakeEvent.start();

    window.addEventListener('orientationchange', this.elfWorld.updateGravity.bind(this.elfWorld));
    window.addEventListener('deviceorientation', this.elfWorld.updateGravity.bind(this.elfWorld), true);
    window.addEventListener('shake', this.elfWorld.randomImpulse.bind(this.elfWorld), false);
    document.body.classList.add('home');

  }

  stop() {
    window.removeEventListener('orientationchange', this.elfWorld.updateGravity.bind(this.elfWorld));
    window.removeEventListener('deviceorientation', this.elfWorld.updateGravity.bind(this.elfWorld), true);
    window.removeEventListener('shake', this.elfWorld.randomImpulse.bind(this.elfWorld), false);

    this.shakeEvent.stop();
    this.elfWorld.stop();
    document.body.classList.remove('home');
  }

  reset() {
    this.elfWorld.reset();
  }

  componentDidMount () {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  render() {
    return null;
  }
}

