"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceEditor = void 0;
const ApplicationEditor_1 = require("../ApplicationEditor/ApplicationEditor");
const PageEditor_1 = require("../PageEditor/PageEditor");
const path = require('path');
const Editor = require('../Editor');
class DataSourceEditor extends Editor {
    static createData(params) {
        return {
            '@class': 'DataSource',
            '@attributes': {
                name: params.name,
                database: params.database || 'default',
                table: params.table || '',
            },
            keyColumns: [
                ...(params.keyColumns ? params.keyColumns.map(Editor.createItemData) : [])
            ],
        };
    }
    async getCollectionDirPath() {
        const customDirPath = await this.parent.getCustomDirPath();
        return path.join(customDirPath, 'dataSources');
    }
    async createModelBackJs(params) {
        const filePath = path.join(await this.getCustomDirPath(), 'Model.back.js');
        const templateFilePath = path.join(__dirname, 'Model.back.js.ejs');
        const js = await this.createFileByParams(filePath, templateFilePath, {
            _class: this.getClassName(),
            page: params.page ? params.page : '',
            form: params.form ? params.form : '',
            dataSource: this.getName(),
        });
        return js;
    }
    getColName() {
        return 'dataSources';
    }
    async save() {
        if (this.parent instanceof ApplicationEditor_1.ApplicationEditor) {
            await this.parent.appFile.save();
        }
        else if (this.parent instanceof PageEditor_1.PageEditor) {
            await this.parent.pageFile.save();
        }
        else {
            await this.parent.getParent().pageFile.save();
        }
    }
}
exports.DataSourceEditor = DataSourceEditor;
