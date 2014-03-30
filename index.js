/* jshint node: true */
'use strict';

var hid = require('pull-hid');
var pull = require('pull-stream');
var KNOWN_CONTROLLERS = [
  [0x12ba, 0x0100] // PS3 guitar hero controller vendor, product id pair
];

/**
  # gh-controller

  This is a node module for interfacing with a Guitar Hero wireless controller
  using the [node-hid](https://github.com/node-hid/node-hid) module to
  interface with the device.

  Tested with the PS3 controller on Linux.

**/

module.exports = function(opts) {
  var device = KNOWN_CONTROLLERS.map(hid).filter(Boolean)[0];

  if (! device) {
    return console.log('No guitar hero controllers found');
  }

  pull(
    device.read(),
    pull.drain(console.log)
  );
};