import React from 'react';
import jQuery from 'jQuery';
import BootstrapSlider from 'bootstrap-slider';

let Slider = React.createClass({

  propTypes: {
    id: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number,
    value: React.PropTypes.number.isRequired,
    toolTip: React.PropTypes.bool,
    onSlide: React.PropTypes.func,
    width: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      min: 0,
      max: 100,
      step: 1,
      value: 50,
      toolTip: false,
      width: '200px',
      onSlide() {},
      onSlideStop() {}
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    nextState.slider.setValue(nextProps.value);
  },

  componentDidMount: function() {
    let toolTip = this.props.toolTip ? 'show' : 'hide';

    let domNode = this.getDOMNode();
    domNode.style.width = this.props.width;
    let slider = new BootstrapSlider(domNode, {
      id: this.props.id,
      min: this.props.min,
      max: this.props.max,
      step: this.props.step,
      value: this.props.value,
      tooltip: toolTip
    });
    
    slider.on('slide', event => {
      this.props.onSlide(event);
      this.state.slider.setValue(event.value);
    });

    slider.on('slideStop', event => {
      this.props.onSlideStop(event);
      this.state.slider.setValue(event.value);
    });

    this.setState({
      slider: slider
    });
  },

  render() {
    return (
      <div className="volume-slider" />
    );
  }
});

export default Slider;