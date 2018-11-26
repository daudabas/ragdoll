import React from 'react';
import Game from './game';
import Popup from 'reactjs-popup';
import Info from '../info';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.gameRef = React.createRef();
  }

  reset() {
    this.gameRef.current.reset();
  }

  render() {
    return (
      <div>
        <Game ref={this.gameRef} />
        <div className="share">
          <button onClick={this.reset.bind(this)}>reload</button>
          <button>camera</button>
          <button>share</button>
          <Popup trigger={<button>Info</button>} modal closeOnDocumentClick>
            <Info />
          </Popup>
        </div>
      </div>
    );
  }
}