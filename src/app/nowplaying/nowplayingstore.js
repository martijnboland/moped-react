let Reflux = require('reflux');
let actions = require('../actions');
let mopidyStore = require('../stores/mopidystore');
let util = require('../util.js');
let connectionStates = require('../constants').connectionStates;

let checkPositionTimer;

let nowPlayingStore = Reflux.createStore({
  isSeeking: false,
  defaultTrackImageUrl: 'assets/images/vinyl-icon.png',
  getInitialState() {
    return this.nowPlayingState;
  },
  init() {
    this.resetState();
    this.listenTo(mopidyStore, this.onConnectionStateUpdated);
    this.listenTo(actions.mopidyCalled, this.onMopidyCalled);
    this.listenTo(actions.getPlaybackState.completed, this.onGetPlaybackStateCompleted);
    this.listenTo(actions.getCurrentTrack.completed, this.onUpdateCurrentTrack);
    this.listenTo(actions.getTimePosition.completed, this.onUpdateTimePosition);
    this.listenTo(actions.seeking, this.onSeeking);
    this.listenTo(actions.seek, this.onSeek);
  },
  onConnectionStateUpdated(connectionState) {
    if (connectionState === connectionStates.online) {
      actions.getPlaybackState();
      actions.getCurrentTrack();
    } else {
      clearInterval(checkPositionTimer);
      this.resetState();
    }
    this.trigger(this.nowPlayingState);
  },
  onMopidyCalled(ev, args) {
    let self = this;
    switch(ev) {
      case 'event:playbackStateChanged':
        if (args.new_state === 'playing') {
          checkPositionTimer = setInterval(() => {
            self.checkTimePosition();
          }, 1000); 
        }
        else {
          clearInterval(checkPositionTimer);
        }
        break;
      case 'event:trackPlaybackStarted':
      case 'event:trackPlaybackPaused':
        this.onUpdateCurrentTrack(args.tl_track.track);
        this.onUpdateTimePosition(args.time_position);
        break;
    }
  },
  onGetPlaybackStateCompleted(state) {
    let self = this;
    if (state === 'playing') {
      checkPositionTimer = setInterval(() => {
          self.checkTimePosition();
        }, 1000);   
    }
  },
  onUpdateCurrentTrack(track) {
    actions.getTimePosition();
    if (track) {
      this.nowPlayingState.track = track;
      this.trigger(this.nowPlayingState);
    }
  },
  onUpdateTimePosition(timePosition) {
    let currentTrack = this.nowPlayingState.track;
    if (currentTrack !== null && timePosition !== null && currentTrack.length > 0) {
      this.nowPlayingState.timePosition = (timePosition / currentTrack.length) * 100;
      this.nowPlayingState.trackPosition = util.timeFromMilliSeconds(timePosition);
    }
    else
    {
      this.nowPlayingState.timePosition = 0;
      this.nowPlayingState.trackPosition = util.timeFromMilliSeconds(0);
    }
    this.trigger(this.nowPlayingState);
  },
  onSeeking() {
    this.isSeeking = true;
  },
  onSeek() {
    this.isSeeking = false;
  },
  resetState() {
    this.nowPlayingState = {
      track: {
        name: '',
        artists: []
      },
      timePosition: 0, // 0-100
      trackPosition: util.timeFromMilliSeconds(0),
      albumImageUri: this.defaultTrackImageUrl
    };
  },
  checkTimePosition() {
    if (! this.isSeeking) {
      actions.getTimePosition();
    }
  }
});

module.exports = nowPlayingStore;