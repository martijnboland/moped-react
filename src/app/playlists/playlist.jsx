import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import _ from 'lodash';
import playlistsStore from './store';
import actions from '../actions';

import TrackList from '../widgets/tracklist.jsx';

let Playlist = React.createClass({
  mixins: [
    Reflux.listenTo(playlistsStore, 'onPlaylistsChanged', 'onPlaylistsChanged'),
    Reflux.listenTo(actions.playTrackRequest, 'onPlayTrackRequest'),
    Router.State
  ],
  getInitialState() {
    return {
      playlists: [],
      currentPlaylistUri: null,
      currentPlaylist: null
    }
  },
  componentWillMount() {
    this.loadPlaylist();
  },
  componentWillReceiveProps() {
    this.loadPlaylist();
  },
  onPlaylistsChanged(playlists) {
    let currentPlaylist = _.find(playlists, { uri: this.state.currentPlaylistUri });
    this.setState({ playlists: playlists, currentPlaylist: currentPlaylist })
  },
  onPlayTrackRequest(track) {
    let surroundingTracks = this.state.currentPlaylist ? this.state.currentPlaylist.tracks : [];
    actions.playTrack(track, surroundingTracks);
  },
  loadPlaylist() {
    let uri = this.getParams().uri;
    let currentPlaylist = null;
    if (this.state.playlists.length > 0) {
      currentPlaylist = _.find(this.state.playlists, { uri: uri });
    }
    this.setState({ currentPlaylistUri: uri, currentPlaylist: currentPlaylist });
  },
  render() {
    if (this.state.currentPlaylist) {
      return (
        <div>
          <div className="row view-title">
            <h3>{this.state.currentPlaylist.name}</h3>
          </div>
          <TrackList tracks={this.state.currentPlaylist.tracks}/>
        </div>
      )
    } else {
      return (
        <div/>
      )
    }
  }
});

export default Playlist;
