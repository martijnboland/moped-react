global.jQuery = require('jQuery');
var bs = require('bootstrap');

var React = require('react'); 
var Reflux = require('reflux');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Header = require('./header.jsx');
var NowPlaying = require('./nowplaying/nowplaying.jsx')
var PlayerControls = require('./playback/playercontrols.jsx');
var PlaylistMenu = require('./playlists/playlistmenu.jsx')

var Home = require('./home.jsx');
var Playlist = require('./playlists/playlist.jsx')
var Settings = require('./settings/settings.jsx');

var MainStore = require('./stores/mainstore');

var Main = React.createClass({
  mixins: [Reflux.connect(MainStore)],
  render: function () {
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

var routes = (
  <Route name="main" path="/" handler={Main}>
    <Route name="playlist" path="playlist/:uri" handler={Playlist}/>
    <Route name="settings" handler={Settings}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

module.exports = Main;