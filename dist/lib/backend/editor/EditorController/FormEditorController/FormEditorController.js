"use strict";
const VisualEditorController_1 = require("../VisualEditorController");
class FormEditorController extends VisualEditorController_1.VisualEditorController {
    /*constructor(...args) {
        super(...args);
    }*/
    async _new(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params['pageFileName']);
        const data = await pageEditor.newItemData(params.class, 'forms', params);
        await pageEditor.save();
        return data;
    }
    async save(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params['pageFileName']);
        const formEditor = pageEditor.createItemEditor('forms', params.form);
        formEditor.setAttr(params['attr'], params['value']);
        await pageEditor.save();
        return null;
    }
    async delete(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params.pageFileName);
        const data = pageEditor.removeColData('forms', params.form);
        await pageEditor.save();
        return data;
    }
    async moveUp(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params.pageFileName);
        pageEditor.moveItemUp('forms', params.form);
        await pageEditor.save();
        return 'ok';
    }
    async moveDown(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params.pageFileName);
        pageEditor.moveItemDown('forms', params.form);
        await pageEditor.save();
        return 'ok';
    }
    async getView(params) {
        console.log('FormEditorController.getView');
        const result = await super.getView(params);
        switch (params.view) {
            case 'VisualView.html':
                const appEditor = this.createApplicationEditor();
                const pageEditor = await appEditor.getPage(params.page);
                const formEditor = pageEditor.createItemEditor('forms', params.form);
                // @ts-ignore
                result.data.js = await formEditor.getCustomFile('js');
                // @ts-ignore
                result.data.jsx = await formEditor.getCustomFile('jsx');
                // @ts-ignore
                result.data.less = await formEditor.getCustomFile('less');
                return result;
            default:
                return result;
        }
    }
    async createController(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const formEditor = pageEditor.createItemEditor('forms', params.form);
        const js = await formEditor.createJs(params);
        return { js };
    }
    async createView(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const formEditor = pageEditor.createItemEditor('forms', params.form);
        const jsx = await formEditor.createJsx(params);
        return { jsx };
    }
    async createStyle(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const formEditor = pageEditor.createItemEditor('forms', params.form);
        const less = await formEditor.createLess(params);
        return { less };
    }
    async saveController(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const formEditor = pageEditor.createItemEditor('forms', params.form);
        await formEditor.saveCustomFile('js', params.text);
        return { js: params.text };
    }
    async createModelBackJs(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const formEditor = pageEditor.createItemEditor('forms', params.form);
        const js = await formEditor.createModelBackJs(params);
        return { js };
    }
}
module.exports = FormEditorController;
