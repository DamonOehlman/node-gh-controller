/* jshint node: true */
'use strict';

var HID = require('node-hid');
var extend = require('cog/extend');
var pluck = require('whisk/pluck');

// create the cameras list
// this provides the vendor & product id combinations for various
// cameras
var controllers = [
  { name: 'PS3', vendorId: 0x12ba, productId: 0x0100 }
];
/**
  # confcam

  This is a node module for interfacing with the Logitech BCC950 pan, tilt
  and zoom controls via USB.

  ## Example Usage

  <<< examples/control.js

**/

module.exports = function(opts) {
  var targetDevice = (opts || {}).controller || 'auto';
  var devices = HID.devices().map(identifyController).filter(pluck('name'));
  var selected = devices.filter(function(d) {
    return targetDevice === 'auto' || d.name === targetDevice;
  })[0];
  var activeController;

  function handleData(err, buffer) {
    if (err) {
      throw err;
    }

    console.log(buffer);
    activeController.read(handleData);
  }

  // if we don't have any selected devices, then abort
  if (! selected) {
    throw new Error('Unable to find a known controller');
  }

  // load the active cam
  activeController = new HID.HID(selected.path);
  activeController.read(handleData);
  // console.log(activeCam.getFeatureReport(0x1, 17));

  // activeCam.write([
  //   0x80, // endpoint 0x80, direction in
  //   0x02, // URB_CONTROL
  //   0x08, 0x00, 0x00, 0x00, // length ?
  //   0x00, // control transfer stage: setup (0)
  //   0xA1, // bmRequestType
  //   0x81, // bRequest
  //   0x00, 0x0e, // wValue
  //   0x00, 0x01, // wIndex
  //   0x04, 0x00, // wLength
  // ]);

  // activeCam.write([0x09, 0xE9]); // volume up?
  // activeCam.write([0x09, 0xEA]); // volume dec
  // activeCam.write([0x05, 0x0C]); // ??

};

function identifyController(obj) {
  var controller = controllers.filter(isMatchingController(obj))[0];

  return controller ? extend({}, controller, obj) : obj;
}

function isMatchingController(obj) {
  return function(controller) {
    return obj.vendorId === controller.vendorId &&
      obj.productId === controller.productId;
  };
}