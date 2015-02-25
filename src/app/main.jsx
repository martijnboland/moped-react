global.jQuery = require('jQuery');
let bs = require('bootstrap');

let React = require('react'); 
let Reflux = require('reflux');
let Router = require('react-router');

let DefaultRoute = Router.DefaultRoute;
let Link = Router.Link;
let Route = Router.Route;
let RouteHandler = Router.RouteHandler;

let Header = require('./header.jsx');
let NowPlaying = require('./nowplaying/nowplaying.jsx')
let PlayerControls = require('./playback/playercontrols.jsx');
let PlaylistMenu = require('./playlists/playlistmenu.jsx')

let Home = require('./home.jsx');
let Playlist = require('./playlists/playlist.jsx')
let Settings = require('./settings/settings.jsx');

let MainStore = require('./stores/mainstore');

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

module.exports = Main;