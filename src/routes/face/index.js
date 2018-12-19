import React, { Component } from 'react';
import PinchToZoom from 'react-pinch-and-zoom';
import mask from './images/face_mask.png';
import overlay from './images/face_overlay@2x.png';
import hatHair from './images/hat_hair@2x.png';
import './index.css';
import crypto from 'crypto';

import ImageHelper from './imageHelper';

export default class Face extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.canvas = React.createRef();
    this.pinchToZoom = React.createRef();
    this.faceImage = React.createRef();
    this.overlayDiv = React.createRef();
    this.resultImg = React.createRef();
  }

  componentDidMount() {
    document.body.classList.add('face');
    this.setState({ file : this.props.file}, () => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.faceImage.current.src = reader.result;
        const stageElement = document.getElementById('stage');
        this.faceImage.current.width = stageElement.offsetWidth;
        this.faceImage.current.height = stageElement.offsetHeight;
      }
  
      reader.readAsDataURL(this.state.file);
    });
  }

  componentWillUnmount() {
    document.body.classList.remove('face');
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
    if (this.state.file === null) {
      return;
    }

    document.getElementById('loader-overlay').style.display = "block";

    const maskImage = new Image();
    const hatHairImage = new Image();
    const image = new Image();

    hatHairImage.src = `${window.location.origin}${hatHair}`;
    hatHairImage.onload = () => {
      maskImage.src = `${window.location.origin}${mask}`;
    }

    maskImage.onload = () => {
      ImageHelper.rotateImage(this.state.file, (base64Image) => {
        image.src = base64Image;
      })
    }

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const {currentTranslate, currentZoomFactor } = this.pinchToZoom.current.getTransform();
      let sourceX, sourceY, sourceWidth, sourceHeight;
      const imageWidth = this.faceImage.current.width;
      const imageHeight = this.faceImage.current.height;

      canvas.width = imageWidth;
      canvas.height = imageHeight + 130;
      sourceWidth = imageWidth * currentZoomFactor;
      sourceHeight = imageHeight * currentZoomFactor;
      sourceX = currentTranslate.x * currentZoomFactor;
      sourceY = currentTranslate.y * currentZoomFactor + 65;

      const actualMaskImageWidth = maskImage.width / 2;
      const actualMaskImageHeight = maskImage.height / 2;
      const maskTranslateX = -0.5 * (actualMaskImageWidth - canvas.width);
      const maskTranslateY = -0.5 * (actualMaskImageHeight - canvas.height);

      context.drawImage(maskImage, maskTranslateX, maskTranslateY, actualMaskImageWidth, actualMaskImageHeight);
      context.globalCompositeOperation = 'source-out';
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight);
      context.globalCompositeOperation = 'source-over';

      const hatHairTranslateX = -0.5 * ((hatHairImage.width) - canvas.width);
      const hatHairTranslateY = -0.5 * ((hatHairImage.height) - canvas.height);
      const hatHairOffset = 0.6 * hatHairImage.height;
      context.drawImage(hatHairImage, hatHairTranslateX, hatHairTranslateY - hatHairOffset, hatHairImage.width, hatHairImage.height);
      context.save();

      const newWidth = 304;
      // const newHeight = 470;
      const newHeight = 520;
      const translateX = -0.5 * (canvas.width - newWidth);
      const translateY = -0.5 * (canvas.height - newHeight);
      const croppedBase64Image = ImageHelper.cropImage(canvas, translateX, translateY, newWidth, newHeight);

      this.uploadImage(croppedBase64Image);
    }
  }

  handleChange(event) {
    this.setState({ file : event.target.files[0]}, () => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.faceImage.current.src = reader.result;
      }
  
      reader.readAsDataURL(this.state.file);
    });
  }
  
  render() {
    return (
      <div className="wrapper">
        <div id="loader-overlay">
          <div className="loader"></div>
        </div>
        <div className="header">
          <div className="face-header-left-div">
            <button className="face-cancel-button" onClick={this.props.closeModal}/>
          </div>
          Make sure face is within the crop marks
        </div>
        <div id="stage" className="stage">
          <div className="user-image">
            <PinchToZoom className="face-pinch-zoom" ref={this.pinchToZoom}>
              <img alt="face" className="face-image" ref={this.faceImage} />
            </PinchToZoom>
          </div>
          <div className="overlay" ref={this.overlayDiv}>
            <img alt="overlay" className="face-overlay-img" src={overlay} />
            <img alt="hat" className="hat-hair-img" src={hatHair} />
          </div>
          <div className="footer">
            <div className="face-footer-left-buttons">
              <label className="image-upload">
                Retake
                <input className="face-file-input" type="file" accept="image/*" onChange={(e) => this.handleChange(e)}/>
              </label>
            </div>
            <div className="face-footer-right-buttons">
              <button className="link-button" onClick={this.handleClick.bind(this)}>Use Photo</button>
            </div>
        </div>
        </div>
        
      </div>
    );
  }
}