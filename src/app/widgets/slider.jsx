var React = require('react'),
    jQuery = require('jQuery'),
    BootstrapSlider = require('bootstrap-slider');

var Slider = React.createClass({

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
      onSlide: function () {},
      onSlideStop: function () {}
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    nextState.slider.setValue(nextProps.value);
  },

  componentDidMount: function() {
    var toolTip = this.props.toolTip ? 'show' : 'hide';

    var domNode = this.getDOMNode();
    domNode.style.width = this.props.width;
    var slider = new BootstrapSlider(domNode, {
      id: this.props.id,
      min: this.props.min,
      max: this.props.max,
      step: this.props.step,
      value: this.props.value,
      tooltip: toolTip
    });
    
    slider.on('slide', function(event) {
      this.props.onSlide(event);
      this.state.slider.setValue(event.value);
    }.bind(this));

    slider.on('slideStop', function(event) {
      this.props.onSlideStop(event);
      this.state.slider.setValue(event.value);
    }.bind(this));

    this.setState({
      slider: slider
    });
  },

  render: function() {
    return (
      <div className="volume-slider" />
    );
  }
});

module.exports = Slider;