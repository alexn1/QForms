import path from 'path';
import { VisualEditorController } from '../VisualEditorController';
import { readTextFile } from '../../../file-helper';

export class PageEditorController extends VisualEditorController {
    async get(params) {
        const pageFilePath = path.join(this.appInfo.dirPath, params.fileName);
        const content = await readTextFile(pageFilePath);
        return JSON.parse(content);
    }

    async save(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.createPageEditor(params.fileName);
        pageEditor.setAttr(params.attr, params.value);
        await pageEditor.save();
        return null;
    }

    async _new(params) {
        const appEditor = this.createApplicationEditor();
        const data = await appEditor.newPageAndPageLinkData(params);
        await appEditor.save();
        return data;
    }

    async delete(params) {
        const appEditor = this.createApplicationEditor();
        await appEditor.removePageFile(params.page);
        const data = appEditor.removeColData('pageLinks', params.page);
        await appEditor.save();
        return data;
    }

    async getView(params) {
        const result = await super.getView(params);
        switch (params.view) {
            case 'VisualView.html':
                const appEditor = this.createApplicationEditor();
                const pageEditor = await appEditor.getPage(params.page);
                // @ts-ignore
                result.data.js = await pageEditor.getCustomFile('js');
                // @ts-ignore
                result.data.jsx = await pageEditor.getCustomFile('jsx');
                // @ts-ignore
                result.data.less = await pageEditor.getCustomFile('less');
                return result;
            default:
                return result;
        }
    }

    async createController(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const js = await pageEditor.createJs(params);
        return { js };
    }

    async createView(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const jsx = await pageEditor.createJsx(params);
        return { jsx };
    }

    async createStyle(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const less = await pageEditor.createLess(params);
        return { less };
    }

    async saveController(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        await pageEditor.saveCustomFile('js', params.text);
        return { js: params.text };
    }

    async createModelBackJs(params) {
        const appEditor = this.createApplicationEditor();
        const pageEditor = await appEditor.getPage(params.page);
        const js = await pageEditor.createModelBackJs(params);
        return { js };
    }
}
