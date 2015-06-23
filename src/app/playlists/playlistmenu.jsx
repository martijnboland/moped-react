import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router';
import _ from 'lodash';
import playlistsStore from './store';

let ensureFolderExists = function (folderPaths, processedPlaylists) {
  // Check if a compatible folder exists in processedPlaylists. If not, create and return it.
  let currentFolder = null;
  _.forEach(folderPaths, folderPath => {
    if (currentFolder === null) {
      currentFolder = _.find(processedPlaylists, playlistItem =>
        playlistItem.hasOwnProperty('items') && playlistItem.name === folderPath);
      if (! currentFolder) {
        currentFolder = { name: folderPath, items: [], expanded: false };
        processedPlaylists.push(currentFolder);
      }
    }
    else {
      let previousFolder = currentFolder;
      currentFolder = _.find(previousFolder.items, playlistItem => 
        playlistItem.hasOwnProperty('items') && playlistItem.name === folderPath);
      if (! currentFolder) {
        currentFolder = { name: folderPath, items: [], expanded: false };
        previousFolder.items.push(currentFolder);
      }
    }
  });
  return currentFolder;
};

let processPlaylists = function (playlists) {
  let processedPlaylists = [];
  // Extract playlist folders from playlist names ('/' is the separator) and shove the playlist into
  // the right folders.
  _.forEach(playlists, playlist => {
    let paths = playlist.name.split('/');
    if (paths.length > 1) {
      // Folders, last item in array is the playlist name
      let playlistInFolder = _.cloneDeep(playlist);
      playlistInFolder.name = paths.pop();
      let folder = ensureFolderExists(paths, processedPlaylists);
      folder.items.push(playlistInFolder);
    }
    else {
      processedPlaylists.push(playlist);
    }
  });

  return processedPlaylists;
};

let PlaylistFolder = React.createClass({
  getInitialState() {
    return {
      isExpanded: false
    }
  },
  toggle(e) {
    e.preventDefault();
    this.setState({ isExpanded: ! this.state.isExpanded });
  },
  render() {
    
    let folderItems = () => {
      if (this.state.isExpanded) {
        return <PlaylistList items={this.props.folder.items}/>
      }
      else {
        return null;
      }
    };

    return (
      <div>
        <a href="" onClick={this.toggle}><span className={'glyphicon ' + (this.state.isExpanded ? 'glyphicon-folder-open' : 'glyphicon-folder-close')}></span> {this.props.folder.name}</a>
        <div>{folderItems(this.state.isExpanded)}</div>
      </div>
    );
  }
});

let PlaylistItem = React.createClass({
  render() {
    return (
      <li className="list-group-item">
        <Link to="playlist" params={{uri: this.props.playlist.uri}}><span className="glyphicon glyphicon-music"></span> {this.props.playlist.name}</Link>
      </li>
    );
  }
});

let PlaylistList = React.createClass({
  render() {

    let createItem = item => {
      if (item.items) {
        return <PlaylistFolder key={item.name} folder={item}/>
      } else {
        return <PlaylistItem key={item.uri} playlist={item}/>
      }
    };

    return (
      <ul className={this.props.isTopLevel ? 'list-group' : ''}>
        {this.props.items.map(createItem)}
      </ul>
    );
  }
});

let PlaylistMenu = React.createClass({
  mixins: [Reflux.listenTo(playlistsStore,"onPlaylistsChanged")],
  getInitialState() {
    return {
      playlists: []
    }
  },
  onPlaylistsChanged(playlists) {
    this.setState({ playlists: processPlaylists(playlists) });
  },
  render() {
    return (      
      <div className="panel">
        <div className="panel-heading playlists">Playlists</div>
        <div className="panel-body">
          <PlaylistList items={processPlaylists(this.state.playlists)} isTopLevel={true}/>
        </div>
      </div>
    );
  }
});

export default PlaylistMenu;