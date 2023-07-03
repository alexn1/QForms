import { BackHostApp } from '../../BackHostApp';
import { ApplicationEditor } from '../Editor/ApplicationEditor/ApplicationEditor';
import { AppInfo } from '../../AppInfo';
import { Context } from '../../Context';

export class EditorController {
    appInfo: AppInfo;
    hostApp: BackHostApp;

    constructor(appInfo: AppInfo, hostApp: BackHostApp) {
        if (!hostApp) throw new Error(`no hostApp for ${this.constructor.name}`);
        this.appInfo = appInfo;
        this.hostApp = hostApp;
    }

    async init(context: Context) {}

    async getView(params) {
        console.debug('EditorController.getView');
        return {
            data: {},
        };
    }

    createApplicationEditor() {
        console.debug('EditorController.createApplicationEditor');
        return new ApplicationEditor(this.appInfo.appFile);
    }
}
