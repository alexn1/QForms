"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAreaFieldEditor = void 0;
const FieldEditor_1 = require("../FieldEditor");
class TextAreaFieldEditor extends FieldEditor_1.FieldEditor {
    static createData(params) {
        return {
            '@class': 'TextAreaField',
            '@attributes': Object.assign(Object.assign({}, FieldEditor_1.FieldEditor.createAttributes(params)), { readOnly: params.readOnly ? params.readOnly : 'false', notNull: params.notNull ? params.notNull : 'false', rows: params.rows ? params.rows : '', cols: params.cols ? params.cols : '', validateOnChange: params.validateOnChange ? params.validateOnChange : 'true', validateOnBlur: params.validateOnBlur ? params.validateOnBlur : 'false' }),
        };
    }
}
exports.TextAreaFieldEditor = TextAreaFieldEditor;
