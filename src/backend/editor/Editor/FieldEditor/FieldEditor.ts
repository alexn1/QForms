const path = require('path');
import {Editor} from '../Editor';
const backend = require('../../../../backend');

export class FieldEditor extends Editor {
    static createAttributes(params): any {
        if (!params.name) throw new Error('no name');
        return {
            name        : params.name,
            caption     : params.caption      !== undefined ? params.caption      :    params.name,
            column      : params.column       !== undefined ? params.column       :    params.name,
            defaultValue: params.defaultValue !== undefined ? params.defaultValue :             '',
            value       : params.value        !== undefined ? params.value        :             '',
            param       : params.param        !== undefined ? params.param        :        'false',
            visible     : params.visible      !== undefined ? params.visible    :           'true',
            type        : params.type         !== undefined ? params.type         :             '',
            width       : params.width        !== undefined ? params.width        :             '',
            cssBlock    : params.cssBlock     !== undefined ? params.cssBlock     :             '',
            viewClass   : params.viewClass    !== undefined ? params.viewClass    :             '',
            autoFocus   : params.autoFocus    !== undefined ? params.autoFocus    :        'false',
        }
    }
    changeClass(newClassName) {
        const newData = backend[`${newClassName}Editor`].createData(this.attributes());
        this.setData(this.getColName(), newData);
        return newData;
    }
    async createJs(params) {
        const templateFilePath = path.join(__dirname, 'Field.js.ejs');
        const customJsFilePath = await this.getCustomFilePath('js');
        const js = await this.createFileByParams(customJsFilePath, templateFilePath, {
            page     : this.parent.parent.getName(),
            form     : this.parent.getName(),
            field    : this.getName(),
            formClass: this.parent.constructor.name.replace('Editor', ''),
            _class   : this.constructor.name.replace('Editor', '')
        });
        return js;
    }
    async createJsx(params) {
        const templateFilePath = path.join(__dirname, 'View.jsx.ejs');
        const customJsxFilePath = await this.getCustomFilePath('jsx');
        const jsx = await this.createFileByParams(customJsxFilePath, templateFilePath, {
            page     : this.parent.parent.getName(),
            form     : this.parent.getName(),
            field    : this.getName(),
            formClass: this.parent.constructor.name.replace('Editor', ''),
            _class   : this.constructor.name.replace('Editor', '')
        });
        return jsx;
    }
    async createLess(params) {
        const templateFilePath = path.join(__dirname, 'View.less.ejs');
        const customLessFilePath = await this.getCustomFilePath('less');
        const less = await this.createFileByParams(customLessFilePath, templateFilePath, {
            page     : this.parent.parent.getName(),
            form     : this.parent.getName(),
            field    : this.getName(),
            formClass: this.parent.constructor.name.replace('Editor', ''),
            _class   : this.constructor.name.replace('Editor', '')
        });
        return less;
    }
    async getCollectionDirPath() {
        const customDirPath = await this.parent.getCustomDirPath();
        const dirPath = path.join(customDirPath, 'fields');
        return dirPath;
    }
    getColName() {
        return 'fields';
    }
}
