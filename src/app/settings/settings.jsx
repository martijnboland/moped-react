var React = require('react');
var Reflux = require('reflux');
var SettingsStore = require('./store');
var SettingsActions = require('./actions');

var Settings = React.createClass({
  mixins: [Reflux.connect(SettingsStore)],
  handleUrlChange: function (e) {
    this.setState({ mopidyUrl: e.target.value });
  },
  verifyConnection: function (e) {
    e.preventDefault();
    SettingsActions.verifyMopidyUrl(this.state.mopidyUrl);
  },
  saveSettings: function (e) {
    e.preventDefault();
    SettingsActions.save(this.state);
  },
  render: function () {
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