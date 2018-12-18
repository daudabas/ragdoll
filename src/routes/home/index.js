import React from 'react';
import Game from './game';
import Modal from 'react-modal';
import Info from '../info';
import Face from '../face';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root');

function preventDefault(e){
  e.preventDefault();
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.gameRef = React.createRef();
    this.state = {
      infoModalIsOpen: false,
      faceModalIsOpen: false,
      id: null,
      headURL: null,
      file: null,
    };

    this.openInfoModal = this.openInfoModal.bind(this);
    this.afterOpenInfoModal = this.afterOpenInfoModal.bind(this);
    this.closeInfoModal = this.closeInfoModal.bind(this);

    this.openFaceModal = this.openFaceModal.bind(this);
    this.afterOpenFaceModal = this.afterOpenFaceModal.bind(this);
    this.closeFaceModal = this.closeFaceModal.bind(this);
  }

  componentWillMount() {
      const { id } = this.props.match.params;
      if (typeof id !== 'undefined') {
        this.setState({ id, headURL: `https://2359elf-faces.s3.ap-southeast-1.amazonaws.com/faces/${id}.jpg` });
      } 
  }

  openInfoModal() {
    this.setState({ infoModalIsOpen: true });
  }

  afterOpenInfoModal() {
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
  }

  closeInfoModal() {
    this.setState({ infoModalIsOpen: false });
    document.body.removeEventListener('touchmove', preventDefault, { passive: false });
  }

  openFaceModal() {
    this.setState({ faceModalIsOpen: true });
  }

  afterOpenFaceModal() {
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
  }

  closeFaceModal() {
    this.setState({ faceModalIsOpen: false });
    document.body.removeEventListener('touchmove', preventDefault, { passive: false });
  }

  reset() {
    this.gameRef.current.reset();
  }

  camera() {
    // this.openFaceModal();

    document.getElementById('custom-file-input').click();
  }

  share() {
    if (navigator.share) {

    } else {

    }
  }

  handleFileChange(e) {
    this.setState({ file: e.target.files[0]},() => {
      this.openFaceModal();
    });
  }

  render() {
    return (
      <div>
        <Game ref={this.gameRef} headURL={this.state.headURL} />
        <div className="buttons">
          <div className="left-buttons">
            <button className="refresh" onClick={this.reset.bind(this)} />
            <button className="camera" onClick={this.camera.bind(this)}/>
            <input type="file" id="custom-file-input" accept="image/*;capture=camera" onChange={(e) => this.handleFileChange(e)}/>
            {/* <button className="share" onClick={this.share.bind(this)}/> */}
          </div>
          <div className="right-buttons">
            <button onClick={this.openInfoModal} className="info" />
          </div>
        </div>
        <Modal
          isOpen={this.state.infoModalIsOpen}
          onAfterOpen={this.afterOpenInfoModal}
          onRequestClose={this.closeInfoModal}
          overlayClassName="modal-overlay"
          className="info-modal-content"
        >
          <Info />
          <button className="close" onClick={this.closeInfoModal} />
        </Modal>

        <Modal
          isOpen={this.state.faceModalIsOpen}
          onAfterOpen={this.afterOpenFaceModal}
          onRequestClose={this.closeFaceModal}
          overlayClassName="modal-overlay"
          className="face-modal-content"
        >
          <Face closeModal={this.closeFaceModal.bind(this)} file={this.state.file}/>
          <button className="close" onClick={this.closeFaceModal} />
        </Modal>
      </div>
    );
  }
}