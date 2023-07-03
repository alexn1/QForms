import path from 'path';

import { Editor } from '../Editor';
import { BkHelper } from '../../../BkHelper';
import { BkApplication } from '../../../viewer/BkModel/BkApplication/BkApplication';
import { JsonFile } from '../../../JsonFile';
import { AppInfo } from '../../../AppInfo';
import { PageEditor } from '../PageEditor/PageEditor';
import { BkApplicationScheme } from '../../../viewer/BkModelScheme/BkApplicationScheme/BkApplicationScheme';

export class ApplicationEditor extends Editor<BkApplicationScheme> {
    appInfo: AppInfo;

    constructor(private appFile: JsonFile) {
        super(appFile.data);
        this.appInfo = BkApplication.makeAppInfoFromAppFile(appFile);
    }

    getAppFile(): JsonFile {
        return this.appFile;
    }

    static createData(params) {
        // console.debug('ApplicationEditor.createData', params);
        if (!params.name) throw new Error('no name');
        return {
            '@class': 'Application',
            '@attributes': {
                formatVersion: '0.1',
                name: params.name,
                caption: params.caption || params.name,
                authentication: params.authentication || 'false',
                user: params.user || 'admin',
                password: params.password || 'admin',
                lang: params.lang || 'en',
                theme: params.theme || 'standard',
                cssBlock: params.cssBlock !== undefined ? params.cssBlock : '',
                viewClass: params.viewClass !== undefined ? params.viewClass : '',
                ctrlClass: params.ctrlClass !== undefined ? params.ctrlClass : '',
                modelClass: params.modelClass !== undefined ? params.modelClass : '',
            },
            env: params.env ? params.env : {},
            databases: [...(params.databases ? params.databases.map(Editor.createItemData) : [])],
            dataSources: [
                ...(params.dataSources ? params.dataSources.map(Editor.createItemData) : []),
            ],
            actions: [...(params.actions ? params.actions.map(Editor.createItemData) : [])],
            pageLinks: [...(params.pageLinks ? params.pageLinks.map(Editor.createItemData) : [])],
        };
    }

    static async createAppFile(appFilePath, params) {
        const data = ApplicationEditor.createData(params);
        const appFile = new JsonFile(appFilePath, data);
        await appFile.create();
        return appFile;
    }

    async newPageAndPageLinkData(params) {
        const pagesDirPath = path.join(this.appInfo.dirPath, 'pages');
        const pageDirPath = path.join(pagesDirPath, params.name);
        const pageFilePath = path.join(pageDirPath, params.name + '.json');
        const pageData = PageEditor.createData(params);
        const pageFile = new JsonFile(pageFilePath, pageData);
        await pageFile.create();
        const pageLinkData = this.newItemData('PageLink', 'pageLinks', params);
        return {
            page: pageData,
            pageLink: pageLinkData,
        };
    }

    async save() {
        console.debug('ApplicationEditor.save');
        await this.appFile.save();
    }

    async removePageFile(name) {
        const pageLinkEditor = this.createItemEditor('pageLinks', name);
        const pageFilePath = path.join(this.appInfo.dirPath, pageLinkEditor.getAttr('fileName'));
        await BkHelper.fsUnlink(pageFilePath);
    }

    async createPageEditor(relFilePath): Promise<PageEditor> {
        const pageFilePath = path.join(this.appInfo.dirPath, relFilePath);
        const pageFile = new JsonFile(pageFilePath);
        await pageFile.read();
        return new PageEditor(this, pageFile);
    }

    async getPage(name): Promise<PageEditor> {
        const pageLinkEditor = this.createItemEditor('pageLinks', name);
        const relFilePath = pageLinkEditor.getAttr('fileName');
        return await this.createPageEditor(relFilePath);
    }

    async createJs(params) {
        const customJsFilePath = await this.getCustomFilePath('js');
        const templateFilePath = path.join(__dirname, 'Application.js.ejs');
        const js = await this.createFileByParams(customJsFilePath, templateFilePath, {
            application: this.getName(),
            _class: this.constructor.name.replace('Editor', ''),
        });
        return js;
    }

    async createModelBackJs(params) {
        const filePath = path.join(await this.getCustomDirPath(), 'Model.back.js');
        const templateFilePath = path.join(__dirname, 'Model.back.js.ejs');
        const js = await this.createFileByParams(filePath, templateFilePath, {
            name: this.getName(),
        });
        return js;
    }

    async getCustomDirPath() {
        return this.appInfo.dirPath;
    }

    reformat() {
        this.data = this.appFile.data = ApplicationEditor.createData({
            ...this.attributes(),
            env: this.data.env,
            databases: this.data.databases,
            dataSources: this.data.dataSources,
            actions: this.data.actions,
            pageLinks: this.data.pageLinks,
        });
    }
}
