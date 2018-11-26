import React from 'react';
import './index.css';
import logoImage from './images/logo@2x.png';
import groupImage from './images/group@2x.png';
import { Link } from 'react-router-dom';

export default class Greetings extends React.Component {

  componentDidMount() {
    document.body.classList.add('greetings');
  }

  componentWillUnmount() {
    document.body.classList.remove('greetings');
  }

  render() {
    return (
      <div>
        <div className="greetings-createdby">
          Created by
        </div>
        <div className="greetings-logo">
          <img alt="logo" src={logoImage} />
        </div>
        <div className="greetings-group">
          <img alt="group" src={groupImage} />
        </div>
        <div className="greetings-title">
          Merry Christmas!
        </div>
        <div className="greetings-textbody">
          Happy Holidays from everyone at 2359 Media.
          We hope your holidays will be filled with joy and laughter through the New Year.
        </div>
        <div className="greetings-button">
          <Link to="/home">
            <button className="button">START</button>
          </Link>
        </div>
      </div>
    );
  }
}
