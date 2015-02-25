let React = require('react');
let Reflux = require('reflux');
let actions = require('../actions');
let util = require('../util');

let Track = React.createClass({
  mixins: [Reflux.listenTo(actions.mopidyCalled, 'onMopidyCalled')],
  propTypes: {
    track: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {
      isPlaying: false
    }
  },
  componentWillReceiveProps() {
    this.setState({ isPlaying: false })
  },
  getTrackProvider(track) {
    let provider = track.uri.split(':')[0];
    return (provider.charAt(0).toUpperCase() + provider.slice(1));
  },
  play(e) {
    e.preventDefault();
    actions.playTrackRequest(this.props.track);
  },
  onMopidyCalled(ev, args) {
    if (ev === 'event:trackPlaybackStarted' || ev === 'event:trackPlaybackPaused') {
      this.setState({ isPlaying: args.tl_track.track.uri === this.props.track.uri });
    }
  },
  render() {
    return (
      <a href="" className={'list-group-item row' + (this.state.isPlaying ? ' active' : '')} onClick={this.play}>
        <div className="col-xs-1">{this.props.trackNo}</div>
        <h4 className="col-xs-10 col-sm-5 list-group-item-heading">{this.props.track.name}</h4>
        <div className="clearfix visible-xs"></div>
        <div className="col-xs-1 visible-xs"></div>
        <h4 className="col-xs-9 col-sm-5 list-group-item-heading">{util.getTrackArtistsAsString(this.props.track)}</h4>
        <div className="col-xs-1">{util.getTrackDuration(this.props.track)}</div>
        <div className="clearfix hidden-xs"></div>
        <div className="col-sm-1 hidden-xs"></div>
        <div className="col-sm-5 hidden-xs">{this.props.track.album.name}</div>
        <div className="col-sm-5 hidden-xs">{this.props.track.album.date}</div>
        <div className="col-sm-1 hidden-xs">{this.getTrackProvider(this.props.track)}</div>
      </a>
    );
  }

});

let TrackList = React.createClass({
  propTypes: {
    tracks: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  render() {

    let createTrack = function (track, idx) {
      return <Track key={idx} trackNo={idx + 1} track={track}/>
    }

    return (
      <div className="list-group">
        {this.props.tracks.map(createTrack)}
      </div>
    );
  }

});

module.exports = TrackList;