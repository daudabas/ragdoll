import React from 'react';
import Game from './game';
import Modal from 'react-modal';
import Info from '../info';
import Face from '../face';
// import audioFile from './sounds/audio.mp3';

Modal.setAppElement('#root');

function preventDefault(e){
  e.preventDefault();
}

const messages = [
'Wishing you a magical and blissful holiday! Have a merry Christmas and prosperous New Year!',
'May this Christmas season bring you nothing but fond memories, happiness and laughter!',
'Wish you all the best this holiday season and throughout the year, Merry Christmas!',
'May this festive season sparkle and shine, may all of your wishes and dreams come true, and may you feel this happiness all year round. Merry Christmas!',
'May your heart and home be filled with all of the joys the festive season brings. Merry Christmas and a wonderful New Year!',
'Warmest greetings of this festive season and best wishes for Happiness in the New Year!',
'Warmest thoughts and best wishes for a wonderful Christmas and a Happy New Year!',
'Wishing you a joyous Christmas and a happy and prosperous New Year.',
'May the good times and treasures of the present become the golden memories of tomorrow. Wish you lots of love, joy, and happiness. Merry Christmas!',
'Wishing you a very Merry Christmas and a wonderful New Year.',
'Best wishes for the Holidays, and for health and happiness throughout the coming year.',
'Merry Christmas! With many good wishes for the holiday season and the coming year.',
'Christmas liao leh! Where\'s my present? Kidding lah. Merry Christmas!',
'Happy Holidays and best wishes for the New Year!',
'All I want for Christmas is ang pow. Eh? Wait... Paiseh... Wrong greeting. Merry Christmas!',
];

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
      messageIndex: 0,
      message: messages[0],
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

        let visited = localStorage['alreadyVisited'];
        if (!visited) {
          localStorage['alreadyVisited'] = true;
          window.location.replace(`${window.location.origin}/landing/${id}`);
        }
      } else {
        localStorage['alreadyVisited'] = true;
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
    document.getElementById('custom-file-input').click();
  }

  showGreetings() {
    const displayStyle = document.getElementById('greeting-message-div').style.display;

    if (displayStyle === '') {
      let newIndex = Math.floor(((Math.random() * 100) % messages.length));
      this.setState({ messageIndex: newIndex, message: messages[newIndex] });
      document.getElementById('greeting-message-div').style.display = 'block';
    } else {      
        document.getElementById('greeting-message-div').style.display = '';
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
        {/* <audio src={audioFile} autoPlay/> */}
        <Game ref={this.gameRef} headURL={this.state.headURL} headCallback={this.showGreetings.bind(this)}/>
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
        <div id="greeting-message-div" className="greeting-message">
          <p>{this.state.message}</p>
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