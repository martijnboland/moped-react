let React = require('react');
let Reflux = require('reflux');
let _ = require('lodash');
let Slider = require('../widgets/slider.jsx');
let actions = require('../actions');
let playbackStore = require('./playbackstore');

let PlayerControls = React.createClass({
  mixins: [Reflux.connect(playbackStore)],
  volumeChanged(e) {
    actions.setVolume(e.value);  
  },
  pause(e) {
    e.preventDefault();
    actions.pause();
  },
  play(e) {
    e.preventDefault();
    actions.play();
  },
  prev(e) {  
    e.preventDefault();
    actions.prev();
  },
  next(e) {
    e.preventDefault();
    actions.next();
  },
  toggleRandom(e) {
    e.preventDefault();
    actions.setRandom(! this.state.isRandom);
  },
  render() {

    let playPauseButton = this.state.isPlaying 
      ? <a href="" className="glyphicon glyphicon-pause" role="button" onClick={this.pause}></a>
      : <a href="" className="glyphicon glyphicon-play" role="button" onClick={this.play}></a>

    return (
      <ul className="list-inline">
        <li><a href="" className="glyphicon glyphicon-fast-backward" role="button" onClick={this.prev}></a></li>
        <li>{playPauseButton}</li>
        <li><a href="" className="glyphicon glyphicon-fast-forward" role="button" onClick={this.next}></a></li>
        <li>
          <Slider min={0} max={100} step={1} value={this.state.volume} toolTip={false} onSlideStop={this.volumeChanged} width={'120px'}/>
        </li>
        <li>
          <span className="glyphicon glyphicon-volume-up" />
        </li>
        <li><a href="" className={'glyphicon glyphicon-random' + this.state.isRandom ? ' active' : '' } role="button" onClick={this.toggleRandom}></a></li>
      </ul>
    );
  }

});

module.exports = PlayerControls;