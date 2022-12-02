import {ModelController} from '../ModelController';
import {Page} from '../../../Model/Page/Page';
import {ApplicationView} from './ApplicationView';
import {WebSocketClient} from '../../../WebSocketClient';

export class ApplicationController extends ModelController {
    constructor(model, frontHostApp) {
        // console.log('ApplicationController.constructor', model, view);
        super(model, null);
        this.frontHostApp = frontHostApp;
        this.lastId = 0;
        this.activePage = null;     // active non modal page
        this.modals = [];
        this.statusbar  = null;
        this.homePageName = null;
        this.webSocketClient = null;
    }
    static create(model, frontHostApp) {
        // console.log('ApplicationController.create', 'debug:', ApplicationController.isDebugMode());
        const CustomClass = FrontHostApp.getClassByName(`${model.getName()}ApplicationController`);
        const Class = CustomClass ? CustomClass : ApplicationController;
        return new Class(model, frontHostApp);
    }
    static isDebugMode() {
        return Search.getObj()['debug'] === '1';
    }
    init() {
        // console.log('ApplicationController.init');
        super.init();
        // this.model.on('logout' , this.onLogout);
        this.model.on('request', this.onRequest);
        const pageData = this.model.data.pages[0];
        this.activePage = pageData ? this.createPage(pageData, {
            modal : false,
            params: this.getGlobalParams()
        }) : null;
        document.title = this.getTitle();
        document.documentElement.classList.add(Helper.inIframe() ? 'iframe' : 'not-iframe');
        const activePageName = this.getActivePageName();
        this.homePageName = activePageName ? activePageName : document.title;
    }
    deinit() {
        // this.model.off('logout', this.onLogout);
        this.model.off('request', this.onRequest);
        super.deinit();
    }
    getViewClass() {
        return super.getViewClass() || ApplicationView;
    }
    createView(rootElement) {
        // console.log('ApplicationController.createView');
        this.view = Helper.createReactComponent(rootElement, this.getViewClass(), {ctrl: this});
        if (this.statusbar) {
            this.statusbar.setLastQueryTime(this.model.getAttr('time'));
        }
    }
    onRequest = async e => {
        console.log('onRequest', e);
        if (this.statusbar) {
            this.statusbar.setLastQueryTime(e.time);
        }
        // console.log('e.remoteAppVersion', e.remoteAppVersion);
        // console.log('this.getModel().getData().versions.app', this.getModel().getData().versions.app);
        if (this.getModel().getData().versions.app && this.getModel().getData().versions.app !== e.remoteAppVersion) {
            this.createVersionNotificationIfNotExists();
        }
    }
    createVersionNotificationIfNotExists() {
        // console.log('ApplicationController.createVersionNotificationIfNotExists');
        if (!document.querySelector('.version-notification')) {
            const div = document.createElement('div');
            div.innerHTML = this.getModel().getText().application.versionNotification;
            div.className = 'version-notification';
            document.querySelector(`.${this.getView().getCssBlockName()}__body`).append(div);
        } else {
            // console.log(`version notification already exists`);
        }
    }
    getGlobalParams() {
        return {
            // foo: 'bar'
        };
    }
    // options
    // - modal      : boolean,
    // - newMode    : boolean,
    // - selectMode : boolean,
    // - selectedKey: string,
    // - onCreate   : function,
    // - onSelect   : function,
    // - onClose    : function,
    // - params     : object,
    createPage(pageData, options) {
        if (options.modal === undefined) throw new Error('no options.modal');

        // model
        const pageModel = new Page(pageData, this.model, options);
        pageModel.init();

        // controller
        const pc = PageController.create(pageModel, this, `c${this.getNextId()}`);
        pc.init();

        return pc;
    }
    async openPage(options) {
        console.log('ApplicationController.openPage', options);
        if (!options.name) throw new Error('no name');
        if (options.key) throw new Error('openPage: key param is deprecated');

        // if this page with this key is already opened, then show it
        const pageController = this.findPageControllerByPageNameAndKey(options.name, null);
        // console.log('pageController:', pageController);
        if (pageController) {
            this.onPageSelect(pageController);
            return pageController;
        }

        const {page: pageData} = await this.model.request({
            action : 'page',
            page   : options.name,
            newMode: !!options.newMode,
            params : options.params || {}
        });

        // modal by default
        if (options.modal === undefined) {
            options.modal = true;
        }
        if (!options.onClose) {
            const activeElement = document.activeElement;
            options.onClose = () => {
                if (activeElement) activeElement.focus();
            };
        }
        const pc = this.createPage(pageData, options);
        // console.log('pc:', pc);

        // show
        pc.isModal() ? this.addModal(pc) : this.addPage(pc);
        await this.rerender();

        return pc;
    }
    addModal(ctrl) {
        this.modals.push(ctrl);
    }
    removeModal(ctrl) {
        // console.log('ApplicationController.removeModal', ctrl);
        const i = this.modals.indexOf(ctrl);
        if (i === -1) throw new Error(`cannot find modal: ${ctrl.getId()}`);
        this.modals.splice(i, 1);
    }
    getNextId() {
        this.lastId++;
        return this.lastId;
    }
    getNewId() {
        return `c${this.getNextId()}`;
    }
    addPage(pc) {
        if (this.activePage) {
            this.closePage(this.activePage);
        }
        this.activePage = pc;
        document.title = this.getTitle();
    }
    findPageControllerByPageNameAndKey(pageName, key) {
        if (this.activePage && this.activePage.model.getName() === pageName && this.activePage.model.getKey() === key) {
            return this.activePage;
        }
        return null;
    }
    onPageSelect(pc) {
        console.log('ApplicationController.onPageSelect', pc.model.getName());
    }
    async closePage(pageController) {
        console.log('ApplicationController.closePage', pageController.model.getFullName());
        if (this.modals.indexOf(pageController) > -1) {
            this.modals.splice(this.modals.indexOf(pageController), 1);
        } else if (this.activePage === pageController) {
            this.activePage = null;
            document.title = '';
        } else  {
            throw new Error('page not found');
        }
        await this.rerender();
        pageController.deinit();
        pageController.model.deinit();
    }
    async onActionClick(name) {
        console.log('ApplicationController.onActionClick', name);
    }
    getMenuItemsProp() {
        // console.log('ApplicationController.getMenuItemsProp');
        return [
            // pages & actions
            ...(this.model.data.menu ? Object.keys(this.model.data.menu).map(key => ({
                name : key,
                title: key,
                items: this.model.data.menu[key].map(item => ({
                    type : item.type,
                    name : item.page || item.action,
                    title: item.caption
                }))
            })) : []),
            // user
            ...(this.model.getUser() ? [{
                name : 'user',
                title: `${this.model.getDomain()}/${this.model.getUser().login}`,
                items: [
                    {
                        type : 'custom',
                        name : 'logout',
                        title: 'Logout'
                    }
                ]
            }] : [])
        ];
    }
    onStatusbarCreate = statusbar => {
        this.statusbar = statusbar;
    }
    onLogout = async () => {
        console.log('ApplicationController.onLogout');
        const result = await this.model.request({action: 'logout'});
        location.href = this.getRootPath();
    }
    onMenuItemClick = async (menu, type, name) => {
        console.log('ApplicationController.onMenuItemClick', menu, type, name);
        if (type === 'page') {
            await this.openPage({name: name, modal: false});
            history.pushState({pageName: name}, '', PageController.createLink({page: name}));
        } else if (type === 'action') {
            try {
                const result = await this.onActionClick(name);
                if (!result) {
                    throw new Error(`no handler for action '${name}'`);
                }
            } catch (err) {
                console.error(err);
                await this.alert({message: err.message});
            }
        } else if (type === 'custom' && name === 'logout') {
            await this.onLogout();
        } else {
            throw new Error(`unknown menu type/name: ${type}/${name}`);
        }
    }
    /*getFocusCtrl() {
        if (this.modals.length > 0) {
            return this.modals[this.modals.length - 1];
        }
        return this.activePage;
    }*/
    getActivePageName() {
        if (this.activePage) {
            return this.activePage.getModel().getName();
        }
        return null;
    }
    async onWindowPopState(e) {
        console.log('ApplicationController.onWindowPopState', e.state);
        await this.openPage({
            name : e.state ? e.state.pageName : this.homePageName,
            modal: false
        });
    }
    getTitle() {
        // console.log('ApplicationController.getTitle', this.activePage);
        if (this.activePage) {
            return `${this.activePage.getTitle()} - ${this.getModel().getCaption()}`;
        }
        return this.getModel().getCaption();
    }
    invalidate() {
        if (this.activePage) this.activePage.invalidate();
        this.modals.filter(ctrl => ctrl instanceof PageController).forEach(page => page.invalidate());
    }
    async alert(options) {
        if (!options.title) {
            options.title = this.getModel().getText().application.alert;
        }
        const activeElement = document.activeElement;
        try {
            return await this.frontHostApp.alert(options);
        } finally {
            if (activeElement) activeElement.focus();
        }
    }
    async confirm(options) {
        if (!options.title) {
            options.title = this.getModel().getText().application.confirm;
        }
        if (!options.yesButton) {
            options.yesButton = this.getModel().getText().confirm.yes;
        }
        if (!options.noButton) {
            options.noButton = this.getModel().getText().confirm.no;
        }
        const activeElement = document.activeElement;
        try {
            return await this.frontHostApp.confirm(options);
        } finally {
            if (activeElement) activeElement.focus();
        }
    }
    getRootPath() {
        return '/';
    }
    async openModal(ctrl) {
        this.addModal(ctrl);
        await this.rerender();
    }
    async closeModal(ctrl) {
        this.removeModal(ctrl);
        await this.rerender();
    }
    getHostApp() {
        return this.frontHostApp;
    }
    async connect() {
        const data = this.getModel().getData();
        this.webSocketClient = new WebSocketClient({
            applicationController: this,
            protocol             : data.nodeEnv === 'development' ? 'ws' : 'wss',
            route                : data.route,
            uuid                 : data.uuid,
            userId               : data.user ? data.user.id : null,
        });
        await this.webSocketClient.connect();
    }
    async rpc(name, params) {
        const result = await this.getModel().rpc(name, params);
        /*if (result.errorMessage) {
            this.getHostApp().logError(new Error(result.errorMessage));
            await this.alert({
                title     : this.getModel().getText().application.error,
                titleStyle: {color: 'red'},
                message   : result.errorMessage
            });
        }*/
        return result;
    }
    getDomain() {
        return this.getModel().getDomain();
    }
    getBaseUrl() {
        return `/${this.getDomain()}`;
    }
}

window.ApplicationController = ApplicationController;
