// const path = require('path');
const FieldEditor = require('../FieldEditor');

class FileFieldEditor extends FieldEditor {

    /*constructor(...args) {
        super(...args);
        this.defaultViewDirPath = path.join(
            this.getAppEditor().hostApp.publicDirPath,
            'viewer/class/Controller/ModelController/FieldController/FileFieldController/view'
        );
    }*/

    static createData(params) {
        return {
            '@class'     : 'FileField',
            '@attributes': {
                name        : params['name'],
                caption     : params['caption']      ? params['caption']      : params['name'],
                isVisible   : params['isVisible']    ? params['isVisible']    :         'true',
                defaultValue: params['defaultValue'] ? params['defaultValue'] :             '',
                value       : params['value']        ? params['value']        :             '',
                column      : params['column']       ? params['column']       : params['name'],
                type        : params['type']         ? params['type']         :             '',
                readOnly    : params['readOnly']     ? params['readOnly']     :        'false',
                notNull     : params['notNull']      ? params['notNull']      :        'false',
                param       : params.param           ? params.param           :        'false',
            }
        };
    }

}

module.exports = FileFieldEditor;
