import React from 'react';
import Game from './game';
import Modal from 'react-modal';
import Info from '../info';
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
      modalIsOpen: false,
      id: null,
      headURL: null,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
      const { id } = this.props.match.params;
      if (typeof id !== 'undefined') {
        this.setState({ id, headURL: `https://2359elf-faces.s3.ap-southeast-1.amazonaws.com/faces/${id}.jpg` });
      } 
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    document.body.removeEventListener('touchmove', preventDefault, { passive: false });
  }

  reset() {
    this.gameRef.current.reset();
  }

  render() {
    return (
      <div>
        <Game ref={this.gameRef} headURL={this.state.headURL} />
        <div className="buttons">
          <div className="left-buttons">
            <button className="refresh" onClick={this.reset.bind(this)} />
            <Link to="/camera">
              <button className="camera" />
            </Link>
            <button className="share"/>
          </div>
          <div className="right-buttons">
            <button onClick={this.openModal} className="info" />
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          overlayClassName="modal-overlay"
          className="modal-content"
        >
          <Info />
          <button className="close" onClick={this.closeModal} />
        </Modal>
      </div>
    );
  }
}