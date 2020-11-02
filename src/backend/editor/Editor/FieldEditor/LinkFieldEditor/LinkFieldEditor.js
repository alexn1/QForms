'use strict';

const path = require('path');
const FieldEditor = require('../FieldEditor');

class LinkFieldEditor extends FieldEditor {

    constructor(...args) {
        super(...args);
        this.defaultViewDirPath = path.join(
            this.getAppEditor().hostApp.publicDirPath,
            'viewer/class/Controller/ModelController/FieldController/LinkFieldController/view'
        );
    }

    static createData(params) {
        return {
            '@class' : 'LinkField',
            '@attributes': {
                name:params['name'],
                caption     : params['caption']      ? params['caption']      : params['name'],
                isVisible   : params['isVisible']    ? params['isVisible']    :         'true',
                width       : params['width']        ? params['width']        :            '0',
                defaultValue: params['defaultValue'] ? params['defaultValue'] :             '',
                column      : params['column']       ? params['column']       : params['name'],
                type        : params['type']         ? params['type']         :             '',
                // readOnly    : params['readOnly']     ? params['readOnly']     :        'true',
                notNull     : params['notNull']      ? params['notNull']      :        'false',
                param       : params.param           ? params.param           :        'false',
            }
        };
    }

}

module.exports = LinkFieldEditor;
