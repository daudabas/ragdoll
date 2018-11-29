import React, { Component } from "react";

export default class Decorator extends Component {
  render() {
    var self = this;
    var indexes = this.getIndexes(self.props.slideCount, self.props.slidesToScroll);
    console.log(indexes);
    return (
      <ul style={self.getListStyles()}>
        {
          indexes.map(function(index) {
            return (
// Here are the dots. You can see that they are <li> elements 
// within a <ul> element. The <li>'s each have a button inside.
// Down below you'll find the getButtonStyles() function.
              <li style={self.getListItemStyles()} key={index}>
                <button
                  style={self.getButtonStyles(self.props.currentSlide === index)}
                  onClick={self.props.goToSlide.bind(null, index)}>
                  &bull;
                </button>
              </li>
            )
          })
        }
      </ul>
    )
  }

  getIndexes(count, inc) {
    var arr = [];
    for (var i = 0; i < count; i += inc) {
      arr.push(i);
    }
    return arr;
  }

  getListStyles() {
    return {
      position: 'relative',
      margin: 0,
      top: -10,
      padding: 0
    }
  }

  getListItemStyles() {
    return {
      listStyleType: 'none',
      display: 'inline-block'
    }
  }

  getButtonStyles(active) {
    return {
      border: 0,
      background: 'transparent',
      color: 'white',
      cursor: 'pointer',
// Here is your padding. 
      padding: 1,
      outline: 0,
      fontSize: 28,
      opacity: active ? 1 : 0.5
    }
  }
}