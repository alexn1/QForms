const path = require('path');
const fs   = require('fs');
const _    = require('underscore');
const EditorController = require('../EditorController');

class KeyColumnEditorController extends EditorController {

    /*constructor(...args) {
        super(...args);
    }*/

    async _new(params) {
        const appEditor = await this.createApplicationEditor();
        if (params.page) {
            const pageEditor = await appEditor.createPageEditor(params.page);
            if (params.form) {
                const formEditor = pageEditor.createFormEditor(params.form);
                const dataSourceEditor = formEditor.createDataSourceEditor(params.dataSource);
                const keyColumnData = dataSourceEditor.newKeyColumnData(params);
                await pageEditor.save();
                return keyColumnData;
            } else {
                const dataSourceEditor = pageEditor.createDataSourceEditor(params.dataSource);
                const keyColumnData = dataSourceEditor.newKeyColumnData(params);
                await pageEditor.save();
                return keyColumnData;
            }
        } else {
            const dataSourceEditor = appEditor.createDataSourceEditor(params.dataSource);
            const keyColumnData = dataSourceEditor.newKeyColumnData(params);
            await appEditor.appFile.save();
            return keyColumnData;
        }
    }

    async save(params) {
        const appEditor = await this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params.pageFileName);
        const formEditor = pageEditor.createFormEditor(params.form);
        formEditor.setDataSourceKeyColumnAttr(params['dataSource'], params['keyColumn'], params['attr'], params['value']);
        await pageEditor.save();
        return null;
    }

    async delete(params) {
        const appEditor = await this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params.page);
        const formEditor = pageEditor.createFormEditor(params.form);
        const dataSourceEditor = formEditor.createDataSourceEditor(params.dataSource);
        const data = dataSourceEditor.removeColData('keyColumns', params.keyColumn);
        await pageEditor.save();
        return data;
    }

}

module.exports = KeyColumnEditorController;
