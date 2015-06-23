import Reflux from 'reflux';

let Actions = Reflux.createActions({ 
  'verifyMopidyUrl': { asyncResult: true },
  'verifyMopidyUrlReady': {},
  'save': {},
  'saved': {}
});

export default Actions;