let _ = require('lodash');

let util = {
  timeFromMilliSeconds(length) {
    if (length === undefined) {
      return '';
    }
    let d = Number(length/1000);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
  },
  getTrackArtistsAsString(track) {
    return this.getArtistsAsString(track.artists);
  },
  getArtistsAsString(artists) {
    return _.map(artists, 'name').join(',');
  },
  getTrackDuration(track) {
    return this.timeFromMilliSeconds(track.length);
  },
  isValidStreamUri(uri) {
    let regexp = /(mms|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(uri);
  },
  urlEncode(textToEncode) {
    return window.encodeURIComponent(textToEncode);
  },
  doubleUrlEncode(textToEncode) {
    return window.encodeURIComponent(window.encodeURIComponent(textToEncode));
  },
  directoryUrlEncode(textToEncode) {
    return window.encodeURIComponent(window.encodeURIComponent(textToEncode));
  },
  urlDecode(textToDecode) {
    return window.decodeURIComponent(textToDecode);
  },
  doubleUrlDecode(textToDecode) {
    return window.decodeURIComponent(window.decodeURIComponent(textToDecode));
  }
};

module.exports = util;