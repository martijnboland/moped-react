let Reflux = require('reflux');
let actions = require('../actions');
let mopidyStore = require('../stores/mopidystore');
let connectionStates = require('../constants').connectionStates;

let playbackStore = Reflux.createStore({
  getInitialState() {
    return this.playbackState;
  },
  init() {
    this.playbackState = {
      isEnabled: false,
      isPlaying: false,
      isRandom: false,
      volume: 0
    };
    this.listenTo(mopidyStore, this.onConnectionStateUpdated);
    this.listenTo(actions.mopidyCalled, this.onMopidyCalled);
    this.listenTo(actions.getPlaybackState.completed, this.onGetPlaybackStateCompleted);
    this.listenTo(actions.getVolume.completed, this.onGetVolumeCompleted);
    this.listenTo(actions.getRandom.completed, this.onGetRandomCompleted);
  },
  onConnectionStateUpdated(connectionState) {
    this.playbackState.isEnabled = connectionState === connectionStates.online;
    actions.getPlaybackState();
    actions.getVolume();
    actions.getRandom();
    this.trigger(this.playbackState);
  },
  onMopidyCalled(ev, args) {
    switch(ev) {
      case 'event:playbackStateChanged':
        this.playbackState.isPlaying = args.new_state === 'playing';
        this.trigger(this.playbackState);
        break;
      case 'event:volumeChanged':
        this.playbackState.volume = args.volume;
        this.trigger(this.playbackState);
        break;
    }
  },
  onGetPlaybackStateCompleted: function (state) {
    this.playbackState.isPlaying = state === 'playing';
    this.trigger(this.playbackState);
  },
  onGetVolumeCompleted: function (volume) {
    this.playbackState.volume = volume;
    this.trigger(this.playbackState);
  },
  onGetRandomCompleted: function (isRandom) {
    this.playbackState.isRandom = isRandom === true;
    this.trigger(this.playbackState);
  }
});

module.exports = playbackStore;