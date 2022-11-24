"use strict";
const FormEditor_1 = require("../FormEditor");
const Editor = require('../../Editor');
class RowFormEditor extends FormEditor_1.FormEditor {
    static createData(params) {
        // console.log('RowFormEditor.createData', params);
        return {
            '@class': 'RowForm',
            '@attributes': Object.assign(Object.assign({}, FormEditor_1.FormEditor.createAttributes(params)), { newMode: params.newMode ? params.newMode : '', backOnly: params.backOnly ? params.backOnly : 'false', refreshButton: params.refreshButton || 'false' }),
            dataSources: [
                ...(params.dataSources ? params.dataSources.map(Editor.createItemData) : [])
            ],
            actions: [
                ...(params.actions ? params.actions.map(Editor.createItemData) : [])
            ],
            fields: [
                ...(params.fields ? params.fields.map(Editor.createItemData) : [])
            ],
        };
    }
}
module.exports = RowFormEditor;
