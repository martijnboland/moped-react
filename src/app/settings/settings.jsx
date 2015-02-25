let React = require('react');
let Reflux = require('reflux');
let settingsStore = require('./store');
let settingsActions = require('./actions');

let Settings = React.createClass({
  mixins: [Reflux.connect(settingsStore)],
  handleUrlChange(e) {
    this.setState({ mopidyUrl: e.target.value });
  },
  verifyConnection(e) {
    e.preventDefault();
    settingsActions.verifyMopidyUrl(this.state.mopidyUrl);
  },
  saveSettings(e) {
    e.preventDefault();
    settingsActions.save(this.state);
  },
  render() {
    return  (
      <form role="form" onSubmit={this.saveSettings}>
        <h3>Settings</h3>
        <label for="mopidyUrl">Mopidy Web Socket url</label>
        <div className="form-group row">
          <div className="col-sm-9">
            <input type="text" className="form-control" id="mopidyUrl" value={this.state.mopidyUrl} onChange={this.handleUrlChange} />
            <span className="help-block">Leave empty for default, example url: ws://hostname:6680/mopidy/ws/</span>
          </div>
          <div className="col-sm-3">
            <button className="btn btn-default" onClick={this.verifyConnection}>Verify connection</button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Save settings</button>
      </form>
    );
  }
});


module.exports = Settings;