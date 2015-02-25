let Reflux = require('reflux');
let actions = require('../actions');
let mopidyStore = require('./mopidystore');

let mainStore = Reflux.createStore({
  getInitialState() {
    this.appState = {
      isSidebarVisibleForMobile: false,
      isBackVisible: false,
      connectionState: null,
    };
    return this.appState;
  },
  init() {
    this.listenTo(mopidyStore, this.onConnectionStateUpdated);
    this.listenTo(actions.toggleSidebar, this.onToggleSidebar);
  },
  onToggleSidebar() {
    this.appState.isSidebarVisibleForMobile = ! this.appState.isSidebarVisibleForMobile;
    this.trigger(this.appState);
  },
  onConnectionStateUpdated(connectionState) {
    this.appState.connectionState = connectionState;
    this.trigger(this.appState);
  }
});

module.exports = mainStore;