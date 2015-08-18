'use strict';

module.exports = TextBoxFieldEditor;

var util = require('util');
var path = require('path');

var server      = require('../../../../server');

var FieldEditor = require('../FieldEditor');

util.inherits(TextBoxFieldEditor, FieldEditor);

////////////////////////////////////////////////////////////////////////////////////////////////////
function TextBoxFieldEditor(formEditor, name) {
    TextBoxFieldEditor.super_.call(this, formEditor, name);
    this.defaultViewDirPath = path.join(
        server.get('public'),
        'viewer/class/Controller/ModelController/FieldController/TextBoxFieldController/view'
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
TextBoxFieldEditor.createData = function(params) {
    return {
        '@class':'TextBoxField',
        '@attributes': {
            name          : params['name'],
            caption       : params['caption']      ? params['caption']      : params['name'],
            isVisible     : params['isVisible']    ? params['isVisible']    : 'true',
            width         : params['width']        ? params['width']        : '0',
            defaultValue  : params['defaultValue'] ? params['defaultValue'] : '',
            column        : params['column']       ? params['column']       : params['name'],
            readOnly      : params['readOnly']     ? params['readOnly']     : 'false',
            notNull       : params['notNull']      ? params['notNull']      : 'false',
            align         : params['align']        ? params['align']        : 'left'
        }
    };    
};