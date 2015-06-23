import React from 'react';
import Reflux from 'reflux';
import Slider from '../widgets/slider.jsx';
import actions from '../actions';
import nowPlayingStore from './nowplayingstore';
import util from '../util';

let CurrentTrack = React.createClass({
  propTypes: {
    track: React.PropTypes.object.isRequired
  },
  render: function () {

    var createArtist = function (artist) {
      return <span>{artist.name}</span>
    };

    return (
      <div className="col-xs-12 col-sm-6 track">
        <img className="nowplaying-thumb" src={this.props.albumImageUri} />
        <h5>{this.props.track.name}</h5>
        <div>
          {this.props.track.artists.map(createArtist)}
        </div>
      </div>
    );

  }
});

let TrackPosition = React.createClass({
  propTypes: {
    trackPosition: React.PropTypes.string,
    trackLength: React.PropTypes.number
  },
  seek: function (ev) {
    if (this.props.trackLength > 0) {
      var milliSeconds = (this.props.trackLength / 100) * ev.value;
      actions.seek(milliSeconds);      
    }
  },
  seeking: function () {
    actions.seeking();
  },
  render: function () {

    return (
      <div className="col-xs-12 col-sm-6 transport">
        <div className="time">
          <div className="pull-left">{this.props.trackPosition}</div>
          <div className="pull-right">{util.timeFromMilliSeconds(this.props.trackLength)}</div>
          <div className="clearfix"></div>
        </div>
        <div className="time-slider-container">
          <Slider min={0} max={100} step={1} value={this.props.timePosition} toolTip={false} onSlide={this.seeking} onSlideStop={this.seek} width={'100%'}/>
        </div>
      </div>
    );

  }
});

let NowPlaying = React.createClass({
  mixins: [Reflux.connect(nowPlayingStore)],
  render: function() {

    return (
      <div>
        <CurrentTrack track={this.state.track} albumImageUri={this.state.albumImageUri}/>
        <div className="clearfix visible-xs"></div>
        <TrackPosition timePosition={this.state.timePosition} trackPosition={this.state.trackPosition} trackLength={this.state.track.length}/>
      </div>
    );

  }
});

export default NowPlaying;