import { IndexView } from './IndexView/IndexView';
import { Helper, FrontHostApp } from '../common';

export class IndexFrontHostApp {
    // data: any;
    view: any = null;;
    currentAppFullName: string | undefined = undefined;
    currentAppEnv: any = undefined;
    modals: any[] = [];
    folderNameTextBox: any = null;
    folderName: string | null = null;
    appName: string | null = null;

    constructor(public data: any) {
        console.log('IndexFrontHostApp.constructor', data);
        // this.data = data;
        // this.view = null;
        // this.currentAppFullName = undefined;
        // this.currentAppEnv = undefined;
        // this.modals = [];
        // this.folderNameTextBox = null;
        // this.folderName = null;
        // this.appName = null;
    }

    init() {
        // console.log('IndexFrontHostApp.init');
        const appInfo = this.data.appInfos[0];
        this.currentAppFullName = appInfo ? appInfo.fullName : undefined;
        this.currentAppEnv = appInfo && appInfo.envs[0] ? appInfo.envs[0] : undefined;
        this.createView(document.querySelector('#root'));
    }

    createView(root) {
        this.view = Helper.createReactComponent(root, IndexView, {
            ctrl: this,
        });
    }

    getAppItems() {
        return this.data.appInfos.map((appInfo) => ({
            value: appInfo.fullName,
            title: appInfo.fullName,
        }));
    }

    getEnvItems() {
        // console.log('IndexFrontHostApp.getEnvItems', this.currentAppFullName);
        if (this.currentAppFullName) {
            const appInfo = this.getAppInfo(this.currentAppFullName);
            if (appInfo) {
                return appInfo.envs.map((env) => ({ value: env, title: env }));
            }
        }
        return [];
    }

    getAppInfo(fullName) {
        // console.log('IndexFrontHostApp.getAppInfo', fullName);
        return this.data.appInfos.find((appInfo) => appInfo.fullName === fullName);
    }

    onAppChange = (fullName) => {
        console.log('IndexFrontHostApp.onAppChange', fullName);
        this.currentAppFullName = fullName;
        const appInfo = this.data.appInfos.find((app) => app.fullName === fullName);
        if (!appInfo) throw new Error(`no appInfo ${fullName}`);
        // console.log('appInfo:', appInfo);
        this.currentAppEnv = appInfo.envs[0];
        this.view.rerender();
    };

    onEnvChange = (env) => {
        console.log('IndexFrontHostApp.onEnvChange', env);
        this.currentAppEnv = env;
    };

    run = (e) => {
        if (this.currentAppFullName) {
            const href = `viewer/${this.currentAppFullName}/${this.currentAppEnv}/domain/`;
            console.log('href:', href);
            window.location.href = href;
        }
    };

    edit = (e) => {
        if (this.currentAppFullName) {
            const href = `editor/${this.currentAppFullName}/${this.currentAppEnv}/domain/`;
            console.log('href:', href);
            window.location.href = href;
        }
    };

    btnCreate_Click = async (e) => {
        this.modals.push({ id: 1 });
        await this.view.rerender();
        this.folderNameTextBox.getElement().focus();
    };

    async createApp(folderName, appName) {
        const data = await FrontHostApp.doHttpRequest({
            action: 'new',
            folder: folderName,
            name: appName,
        });
        console.log('data:', data);
        if (data.appInfos) {
            this.data.appInfos = data.appInfos;
            this.currentAppFullName = `${folderName}/${appName}`;
            this.view.rerender();
        }
    }

    closeModal = () => {
        console.log('IndexFrontHostApp.closeModal');
        this.modals.pop();
        this.view.rerender();
    };

    onFolderNameCreate = (textBox) => {
        console.log('IndexFrontHostApp.onFolderNameCreate');
        this.folderNameTextBox = textBox;
    };

    onFolderNameChange = (folderName) => {
        // console.log('IndexFrontHostApp.onFolderNameChange', folderName);
        this.folderName = folderName;
    };

    onAppNameChange = (appName) => {
        this.appName = appName;
    };

    onCreateClick = async (e) => {
        console.log('IndexFrontHostApp.onCreateClick');
        console.log(this.folderName, this.appName);
        this.closeModal();
        await this.createApp(this.folderName, this.appName);
    };
}
