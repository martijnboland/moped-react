import Reflux from 'reflux';
import Mopidy from 'mopidy';
import SettingsActions from './actions';

let settingsKey = 'moped:settings';

let settingsStore = Reflux.createStore({
  init() {
    this.listenToMany(SettingsActions);
  },
  onVerifyMopidyUrl(mopidyUrl) {
    let mopidy = new Mopidy({ 
      autoConnect: false,
      webSocketUrl: mopidyUrl
    });
    mopidy.on(console.log.bind(console));
    mopidy.on('state:online', () => window.alert('Connection successful.'));
    mopidy.on('websocket:error', error => {
      console.log(error);
      window.alert('Unable to connect to Mopidy server. Check if the url is correct.');
    });

    mopidy.connect();

    setTimeout(() => {
      mopidy.close();
      mopidy.off();
      mopidy = null;
      console.log('Mopidy closed.');
    }, 1000);
  },
  onSave(settings) {
    this.settings = settings;
    window.localStorage[settingsKey] = JSON.stringify(this.settings);
    window.alert('Settings saved');
    this.trigger(this.settings);
  },
  getInitialState() {
    if (window.localStorage[settingsKey]) {
      this.settings = JSON.parse(window.localStorage[settingsKey]);
    }
    else{
      this.settings = { mopidyUrl: '' };
    }
    return this.settings;
  }
});

export default settingsStore;