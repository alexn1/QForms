'use strict';

var HostApp = require('../../viewer/HostApp');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = function(req, res, next) {
    console.log('routes/viewer');
    var hostApp = new HostApp();
    hostApp.init();
    hostApp.actionViewer(req, res, next);
};