'use strict';

var util    = require('util');
var path    = require('path');
var Promise = require('bluebird');

var server  = require('../../../../../server');
var Field   = require('../Field');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class CheckBoxField extends Field {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(data, parent) {
        super(data, parent);
        var self = this;
        self.viewFilePath = path.join(
            server.get('public'),
            'viewer/class/Controller/ModelController/FieldController/CheckBoxFieldController/view',
            self.parent.data['@class'] + self.data['@class'] + 'View.ejs'
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static async create(data, parent) {
        return new CheckBoxField(data, parent);
    }

}

module.exports = CheckBoxField;