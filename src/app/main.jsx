global.jQuery = require('jQuery');

import bs from 'bootstrap';

import React from 'react'; 
import Reflux from 'reflux';
import { default as Router, DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Header from './header.jsx';
import NowPlaying from './nowplaying/nowplaying.jsx';
import PlayerControls from './playback/playercontrols.jsx';
import PlaylistMenu from './playlists/playlistmenu.jsx';

import Home from './home.jsx';
import Playlist from './playlists/playlist.jsx';
import Settings from './settings/settings.jsx';

import MainStore from './stores/mainstore';

let Main = React.createClass({
  mixins: [Reflux.connect(MainStore)],
  render() {
    return  (
      <div id="applicationhost">
        <aside id="menu" className="menu pane-col scroll-y">
          <div className="panel">
            <PlaylistMenu />
            <Link to="settings"><div className="panel-heading settings">Settings</div></Link>
          </div>
        </aside>

        <div className={"main pane-col " + (this.state.isSidebarVisibleForMobile ? " outtaway" : "")}>
          
          <Header 
            isSidebarVisibleForMobile={this.state.isSidebarVisibleForMobile} 
            connectionState={this.state.connectionState} 
            isBackVisible={this.state.isBackVisible}/>
          
          <section id="maincontent" className="maincontent pane-row scroll-y">
            <div className="container">
              <RouteHandler/>
            </div>
          </section>

          <section className="nowplaying pane-row">
            <NowPlaying/>
          </section>

          <section className="controls pane-row">
            <PlayerControls/>            
          </section>
        </div>      
      </div>
    );
  }
});

let routes = (
  <Route name="main" path="/" handler={Main}>
    <Route name="playlist" path="playlist/:uri" handler={Playlist}/>
    <Route name="settings" handler={Settings}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

export default Main;