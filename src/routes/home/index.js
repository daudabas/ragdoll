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
        <div className="buttons">
          <div className="left-buttons">
            <button className="refresh" onClick={this.reset.bind(this)} />
            <button className="camera" />
            <button className="share"/>
          </div>
          <div className="right-buttons">
            <Popup trigger={<button className="info" />} modal closeOnDocumentClick>
              <Info />
            </Popup>
          </div>
        </div>
      </div>
    );
  }
}