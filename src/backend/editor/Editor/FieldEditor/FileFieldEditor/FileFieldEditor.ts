import {FieldEditor} from '../FieldEditor';

class FileFieldEditor extends FieldEditor {

    static createData(params) {
        return {
            '@class'     : 'FileField',
            '@attributes': {
                ...FieldEditor.createAttributes(params),
                readOnly    : params.readOnly     ? params.readOnly     :        'false',
                notNull     : params.notNull      ? params.notNull      :        'false',
            }
        };
    }

}

export = FileFieldEditor;
