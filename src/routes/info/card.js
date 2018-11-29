import React, { Component } from "react";
import './index.css';

export default class Card extends Component {
  render() {
    return (
      <div className="carousel-slide">
        <div className="carousel-card">
          <div className="card-image">
            <img src={this.props.image} />
          </div>
          <div className="card-title">
            <text>{this.props.title}</text>
          </div>
          <div className="card-body">
            <text>{this.props.body}</text>
          </div>
        </div>
      </div>
    );
  }
}