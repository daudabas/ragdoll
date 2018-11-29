import React, { Component } from "react";
import Carousel from 'nuka-carousel';
import Decorator from './decorator';
import Card from './card';
import './index.css';
import infoImage1 from './images/info_image_1.png';
import infoImage2 from './images/info_image_2.png';
import infoImage3 from './images/info_image_3.png';
import infoImage4 from './images/info_image_4.png';
import infoImage5 from './images/info_image_5.png';

const infoPages = [
  {
    image: infoImage1,
    title: 'Thou shall be an elf',
    body: 'Become the elf by taking a photo or upload from your photo gallery!'
  },
  {
    image: infoImage2,
    title: 'Let it snow, let it snow, let it snow~',
    body: 'Tap the background to generate snow!'
  },
  {
    image: infoImage3,
    title: 'There and back again',
    body: 'Press the reset button to revert everything back to normal'
  },
  {
    image: infoImage4,
    title: 'Give it a best pose',
    body: 'Tap and hold any parts of the elf to move him around'
  },
  {
    image: infoImage5,
    title: 'Christmas wishes',
    body: 'Tap the elf to generate christmas greetings and messages'
  },
]

export default class SimpleSlider extends Component {

  componentDidMount() {
    document.body.classList.add('info');
  }

  componentWillUnmount() {
    document.body.classList.remove('info');
  }

  render() {
    const settings = {
      renderCenterLeftControls: null,
      renderCenterRightControls: null,
    }
    return (
      <Carousel 
        {...settings} 
        renderBottomCenterControls={(props) => (<Decorator {...props} />)}
        >
        <Card {...infoPages[0]} />
        <Card {...infoPages[1]} />
        <Card {...infoPages[2]} />
        <Card {...infoPages[3]} />
        <Card {...infoPages[4]} />
      </Carousel>
    );
  }
}