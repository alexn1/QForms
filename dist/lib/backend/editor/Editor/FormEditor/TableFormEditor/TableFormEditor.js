"use strict";
const FormEditor = require('../FormEditor');
const Editor = require('../../Editor');
class TableFormEditor extends FormEditor {
    static createData(params) {
        // console.log('TableFormEditor.createData', params);
        return {
            '@class': 'TableForm',
            '@attributes': Object.assign(Object.assign({}, FormEditor.createAttributes(params)), { editMethod: params.editMethod || 'disabled', itemEditPage: params.itemEditPage || '', itemCreatePage: params.itemCreatePage || '', newRowMode: params.newRowMode || 'disabled', deleteRowMode: params.deleteRowMode || 'disabled', refreshButton: params.refreshButton || 'false' }),
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
module.exports = TableFormEditor;
