let Reflux = require('reflux');
let Mopidy = require('mopidy');
let _ = require('lodash');
let actions = require('../actions');
let settingsStore = require('../settings/store');
let connectionStates = require('../constants').connectionStates;

let consoleError = console.error.bind(console);

let mopidyStore = Reflux.createStore({
  currentTlTracks: [],
  init() {
    this.connectionState = connectionStates.offline;
    this.listenTo(settingsStore, this.onSettingsChanged, this.start); // NOTE: this.start is called here!
    this.listenToMany(actions);
  },
  getInitialState() {
    return this.connectionState;
  },
  start(settings) {
    // Create Mopidy instance
    if (settings.mopidyUrl !== '') {
      this.mopidy = new Mopidy({
        webSocketUrl: settings.mopidyUrl,
        callingConvention: 'by-position-or-by-name'
      });
    } else {
      this.mopidy = new Mopidy({
        callingConvention: 'by-position-or-by-name'
      });
    }

    // Wireup Mopidy events
    this.mopidy.on((ev, args) => {
      actions.mopidyCalled(ev, args);
      if (ev === 'state:online') {
        this.connectionState = connectionStates.online;
        this.trigger(this.connectionState);
      }
      if (ev === 'state:offline') {
        this.connectionState = connectionStates.offline;
        this.trigger(this.connectionState);
      }
    });
  },
  stop() {
    this.mopidy.close();
    this.mopidy.off();
    this.mopidy = null;
  },
  onPlayTrack(track, surroundingTracks) {
    // Check if a playlist change is required. If not just change the track.
    if (this.currentTlTracks.length > 0) {
      let trackUris = _.pluck(surroundingTracks, 'uri');
      let currentTrackUris = _.map(this.currentTlTracks, tlTrack => tlTrack.track.uri);
      if (_.difference(trackUris, currentTrackUris).length === 0) {
        // no playlist change required, just play a different track.
        this.mopidy.playback.stop()
          .then(() => {
            let tlTrackToPlay = _.find(this.currentTlTracks, tlTrack => tlTrack.track.uri === track.uri);
            this.mopidy.playback.play({ tl_track: tlTrackToPlay })
              .then(() => this.mopidy.playback.play());
          });
        return;
      }
    }

    this.mopidy.playback.stop()
      .then(() => {
        this.mopidy.tracklist.clear();
      }, consoleError)
      .then(() => {
        this.mopidy.tracklist.add({ tracks: surroundingTracks });
      }, consoleError)
      .then(() => {
        this.mopidy.tracklist.getTlTracks()
          .then(tlTracks => {
            this.currentTlTracks = tlTracks;
            let tlTrackToPlay = _.find(tlTracks, (tlTrack) => tlTrack.track.uri === track.uri);
            this.mopidy.playback.play({ tl_track: tlTrackToPlay })
              .then(() => {
                this.mopidy.playback.play();
              });
          }, consoleError);
      } , consoleError);
  },
  onSettingsChanged: function (settings) {
    this.stop();
    this.start(settings);
  },
  onLoadPlaylists: function () {
    actions.loadPlaylists.promise(this.mopidy.playlists.getPlaylists());
  },
  onGetPlaybackState: function () {
    actions.getPlaybackState.promise(this.mopidy.playback.getState());
  },
  onGetVolume: function () {
    actions.getVolume.promise(this.mopidy.playback.getVolume());
  },
  onGetRandom: function () {
    actions.getRandom.promise(this.mopidy.tracklist.getRandom());
  },
  onGetTimePosition: function () {
    actions.getTimePosition.promise(this.mopidy.playback.getTimePosition());
  },
  onGetCurrentTrack: function () {
    actions.getCurrentTrack.promise(this.mopidy.playback.getCurrentTrack());
  },
  onPlay: function () {
    this.mopidy.playback.play();
  },
  onPause: function () {
    this.mopidy.playback.pause();
  },
  onPrev: function () {
    this.mopidy.playback.previous();
  },
  onNext: function () {
    this.mopidy.playback.next();
  },
  onSetVolume: function (volume) {
    this.mopidy.playback.setVolume({ volume: volume });
  },
  onSetRandom: function (isRandom) {
    this.mopidy.tracklist.setRandom([ isRandom ]);
  },
  onSeek: function (timePosition) {
    this.mopidy.playback.seek({time_position: timePosition});
  }
});

module.exports = mopidyStore;