import React, { Component } from 'react';
import PinchToZoom from 'react-pinch-and-zoom';
import mask from './images/face_mask.png';
import './index.css';
import crypto from 'crypto';

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

  createDownloadLink(dataURL) {
    const blob = ImageHelper.createFile(dataURL);
    var blobUrl = URL.createObjectURL(blob);
    
    var link = document.createElement("a"); // Or maybe get it from the current document
    link.href = blobUrl;
    link.download = "aDefaultFileName.png";
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  uploadImage(base64Image) {
    var id = crypto.randomBytes(4).toString('hex');
    const encodedImage = base64Image.split(',')[1]

    const data = {
      name: id,
      image: encodedImage,
    }

    const params = {
      method: 'POST',
      body: JSON.stringify(data),
    }
    const url = 'https://humu847pz6.execute-api.ap-southeast-1.amazonaws.com/prod/image';
    fetch(url, params).then((response) => {
      window.location.replace(`${window.location.origin}/home/${id}`);
    });
  }

  handleClick() {
    const maskImage = new Image();
    const image = new Image();

    const {currentTranslate, currentZoomFactor } = this.pinchToZoom.current.getTransform()
    const sourceX = currentTranslate.x * currentZoomFactor;
    const sourceY = currentTranslate.y * currentZoomFactor;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = this.overlayDiv.current.offsetWidth;
    canvas.height = this.overlayDiv.current.offsetHeight;

    maskImage.src = `${window.location.origin}${mask}`;

    maskImage.onload = () => {
      ImageHelper.rotateImage(this.state.file, (base64Image) => {
        image.src = base64Image;
      })

      image.onload = () => {
        const zoom = this.img.current.width / image.width;
        const sourceWidth = image.width * zoom * currentZoomFactor;
        const sourceHeight = image.height * zoom * currentZoomFactor;

        context.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-out';
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight);
        context.save();

        const newWidth = 200;
        const newHeight = 200;
        const translateX = -1 * (canvas.width / 2 - newWidth / 2);
        const translateY = -1 * (canvas.height / 2 - newHeight / 2);
        const croppedBase64Image = ImageHelper.cropImage(canvas, translateX, translateY, newWidth, newHeight);
        
        this.uploadImage(croppedBase64Image);
      }
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