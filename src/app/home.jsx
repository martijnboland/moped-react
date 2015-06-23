import React from 'react'; 

let Home = React.createClass({
  render() {
    return  (
      <div>
        <h3>Moped</h3>
        <p>Moped is an HTML frontend for the <a href="http://www.mopidy.com/">Mopidy music server</a>.</p>
        <h4>Search</h4>
        <p>Find artists, albums or tracks.</p>
        <h4>Playlists</h4>
        <p>All playlists appear in the left menu. Select and play.</p>
        <h4>Radio</h4>
        <p>
          Moped can play radio streams. Select 'Radio', enter the stream address and play. It's possible to store radio stations locally by starring. These stations will appear in the left menu.
          Alternatively, you can also search for radio streams.
        </p>
      </div>
    );
  }
});

export default Home;