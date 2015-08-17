'use strict';

module.exports = DatePickerFieldController;

var util = require('util');
var path = require('path');

var QForms = require('../../../../QForms');
var server             = require('../../../../server');

var FieldController = require('../FieldController');

util.inherits(DatePickerFieldController, FieldController);

////////////////////////////////////////////////////////////////////////////////////////////////////
function DatePickerFieldController(data, parent) {
    DatePickerFieldController.super_.call(this, data, parent);
    this.viewFilePath = path.join(
        server.get('public'),
        'viewer/class/Controller/ModelController/FieldController/DatePickerFieldController/view',
        this.parent.data['@class'] + this.data['@class'] + 'View.ejs'
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
DatePickerFieldController.create = function(data, parent, callback) {
    callback(new DatePickerFieldController(data, parent));
};