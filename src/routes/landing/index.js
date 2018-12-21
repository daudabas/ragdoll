import React from 'react';
import './index.css';
import logoImage from './images/logo@2x.png';
import elvesImage from './images/elves@2x.png';
import { Link } from 'react-router-dom';

function preventDefault(e){
  e.preventDefault();
}

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: 'home'
    };
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    if (typeof id !== 'undefined') {
      this.setState({ link: `/home/${id}` });
    }
  }

  componentDidMount() {
    document.body.classList.add('landing');
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
  }

  componentWillUnmount() {
    document.body.classList.remove('landing');
    document.body.removeEventListener('touchmove', preventDefault, { passive: false });
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
        <div className="greetings-textbody">
          <p>Merry Christmas!</p>
          <p>
          Happy Holidays from everyone at 2359 Media.
          We hope your holidays will be filled with joy and laughter through the New Year.
          </p>
          <p>
          <Link to={this.state.link}>
            <button className="button">START</button>
          </Link>
          </p>
        </div>
        <div className="greetings-elves">
          <img alt="elves" src={elvesImage} />
        </div>
      </div>
    );
  }
}
