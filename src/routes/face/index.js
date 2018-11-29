import React, { Component } from 'react';
import PinchToZoom from 'react-pinch-and-zoom';
import mask from './images/face_mask.png';
import './index.css';

import ImageHelper from './imageHelper';

function preventDefault(e){
  e.preventDefault();
}

export default class Face extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.canvas = React.createRef();
    this.pinchToZoom = React.createRef();
    this.img = React.createRef();
    this.overlayDiv = React.createRef();
    this.resultImg = React.createRef();
  }

  componentDidMount() {
    document.body.classList.add('face');
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
  }

  componentWillUnmount() {
    document.body.classList.remove('face');
    document.body.removeEventListener('touchmove', preventDefault, { passive: false });
  } 

  getRotatedImage(callback) {
    ImageHelper.getOrientation(this.state.file, (orientation) => {
      ImageHelper.rotateBase64Image(this.img.current.src, orientation, (dataURL) => {
        const rotatedImage = new Image();
        rotatedImage.src = dataURL;

        rotatedImage.onload = () => {
          callback(rotatedImage);
        }
      });
    })
  }

  handleClick() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const maskImage = new Image();
    maskImage.src = `${window.location.origin}${mask}`;
    const {currentTranslate, currentZoomFactor } = this.pinchToZoom.current.getTransform()
    const translateX = currentTranslate.x * currentZoomFactor;
    const translateY = currentTranslate.y * currentZoomFactor;

    maskImage.onload = () => {
      this.getRotatedImage((image) => {
        canvas.width = this.overlayDiv.current.offsetWidth;
        canvas.height = this.overlayDiv.current.offsetHeight;
        context.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-out';
        context.drawImage(image, translateX, translateY, this.img.current.width * currentZoomFactor, this.img.current.height * currentZoomFactor);
        this.resultImg.current.src = canvas.toDataURL();
      })
    }
  }

  handleChange(event) {
    this.setState({ file : event.target.files[0]}, () => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.img.current.src = reader.result;
      }
  
      reader.readAsDataURL(this.state.file);
    });
  }
  
  render() {
    return (
      <div className="wrapper">
        <div className="chooseFile">
          <input type="file" accept="image/*;capture=camera" onChange={(e) => this.handleChange(e)}/>
        </div>
        <div className="stage">
          <div className="userImage">
            <PinchToZoom ref={this.pinchToZoom}>
              <img ref={this.img} />
            </PinchToZoom>
          </div>
          <div className="overlay" ref={this.overlayDiv}>
          </div>
        </div>
        <div>
          <button onClick={this.handleClick.bind(this)}>Ok</button>
        </div>
        <div>
          <img ref={this.resultImg} />
        </div>
      </div>
    );
  }
}