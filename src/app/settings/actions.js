let Reflux = require('reflux');

let Actions = Reflux.createActions({ 
  'verifyMopidyUrl': { asyncResult: true },
  'verifyMopidyUrlReady': {},
  'save': {},
  'saved': {}
});

module.exports = Actions;