import path from 'path';

import { Editor } from '../Editor';

export class FormEditor extends Editor {
    static createAttributes(params): any {
        if (!params.name) throw new Error('no name');
        return {
            name: params.name,
            caption: params.caption !== undefined ? params.caption : params.name,
            visible: params.visible !== undefined ? params.visible : 'true',
            cssBlock: params.cssBlock !== undefined ? params.cssBlock : '',
            viewClass: params.viewClass !== undefined ? params.viewClass : '',
            ctrlClass: params.ctrlClass !== undefined ? params.ctrlClass : '',
            modelClass: params.modelClass !== undefined ? params.modelClass : '',
        };
    }

    static createData(params): any {
        console.log('FormEditor.createData', params);
        return {
            '@class': 'Form',
            '@attributes': {
                ...FormEditor.createAttributes(params),
            },
            dataSources: [
                ...(params.dataSources ? params.dataSources.map(Editor.createItemData) : []),
            ],
            actions: [...(params.actions ? params.actions.map(Editor.createItemData) : [])],
            fields: [...(params.fields ? params.fields.map(Editor.createItemData) : [])],
        };
    }

    async createJs(params) {
        const templateFilePath = path.join(__dirname, 'Form.js.ejs');
        const customJsFilePath = await this.getCustomFilePath('js');
        const js = await this.createFileByParams(customJsFilePath, templateFilePath, {
            page: this.parent.getName(),
            form: this.getName(),
            _class: this.constructor.name.replace('Editor', ''),
        });
        return js;
    }

    async createJsx(params) {
        const templateFilePath = path.join(__dirname, 'Form.jsx.ejs');
        const customFilePath = await this.getCustomFilePath('jsx');
        const jsx = await this.createFileByParams(customFilePath, templateFilePath, {
            page: this.parent.getName(),
            form: this.getName(),
            _class: this.constructor.name.replace('Editor', ''),
        });
        return jsx;
    }

    async createLess(params) {
        const templateFilePath = path.join(__dirname, 'Form.less.ejs');
        const customFilePath = await this.getCustomFilePath('less');
        const less = await this.createFileByParams(customFilePath, templateFilePath, {
            page: this.parent.getName(),
            form: this.getName(),
            _class: this.constructor.name.replace('Editor', ''),
        });
        return less;
    }

    async createModelBackJs(params) {
        const filePath = path.join(await this.getCustomDirPath(), 'Model.back.js');
        const templateFilePath = path.join(__dirname, 'Model.back.js.ejs');
        const js = await this.createFileByParams(filePath, templateFilePath, {
            page: this.parent.getName(),
            form: this.getName(),
            _class: this.getClassName(),
        });
        return js;
    }

    async getCollectionDirPath() {
        const customDirPath = await this.parent.getCustomDirPath();
        return path.join(customDirPath, 'forms');
    }

    getColName() {
        return 'forms';
    }
}
