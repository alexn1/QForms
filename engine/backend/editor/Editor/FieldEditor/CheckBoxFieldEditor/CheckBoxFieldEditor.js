'use strict';

module.exports = CheckBoxFieldEditor;

var util = require('util');

var FieldEditor = require('../FieldEditor');
var path = require('path');

var qforms = require('../../../../qforms');
util.inherits(CheckBoxFieldEditor, FieldEditor);

////////////////////////////////////////////////////////////////////////////////////////////////////
function CheckBoxFieldEditor(formEditor, name) {
    CheckBoxFieldEditor.super_.call(this, formEditor, name);
    this.defaultViewDirPath = path.join(
        qforms.get('public'),
        'viewer/class/Controller/ModelController/FieldController/CheckBoxFieldController/view'
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
CheckBoxFieldEditor.createData = function(params) {
    return {
        '@class'     : 'CheckBoxField',
        '@attributes': {
            name        : params['name'],
            caption     : params['caption'] ? params['caption'] : params['name'],
            isVisible   : params['isVisible'] ? params['isVisible'] : 'true',
            width       : params['width'] ? params['width'] : '0',
            defaultValue: params['defaultValue'] ? params['defaultValue'] : '',
            column      : params['column'] ? params['column'] : params['name'],
            readOnly    : params['readOnly'] ? params['readOnly'] : 'false',
            notNull     : params['notNull'] ? params['notNull'] : 'false'
        }
    };
};