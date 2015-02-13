var Reflux = require('reflux');
var actions = require('../actions');

var store = Reflux.createStore({
  init: function () {
    this.listenTo(actions.mopidyCalled, this.onMopidyCalled);
    this.listenTo(actions.loadPlaylists.completed, this.onPlaylistsLoaded);
  },
  getInitialState: function () {
    return this.playlists || [];
  },
  onMopidyCalled: function (ev) {
    if (ev === 'event:playlistsLoaded' || ev === 'state:online') {
      actions.loadPlaylists();
    }
  },
  onPlaylistsLoaded: function (data) {
    this.playlists = data;
    this.trigger(this.playlists);
  }
 });

module.exports = store;