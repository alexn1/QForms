const path          = require('path');
const _             = require('underscore');
const child_process = require('child_process');
const axios         = require('axios');

const qforms  = require('../../../qforms');
const Model   = require('../Model');
const PageLink = require('../PageLink/PageLink');
const Database = require('../Database/Database');
const BaseModel = require('../../../BaseModel');
const Helper = require('../../../Helper');

class Application extends Model {

    static async create(appFilePath, hostApp, env) {
        // console.log('Application.create', appFilePath);
        const appInfo = await Helper.getAppInfo(appFilePath, env);
        const json = await Helper.readTextFile(appInfo.filePath);
        const data = JSON.parse(json);
        const customClassFilePath = path.join(appInfo.dirPath, 'Model.back.js');
        //console.log('customClassFilePath:', customClassFilePath);
        const js = await Helper.getFileContent(customClassFilePath);
        if (js) {
            const customClass = eval(js);
            return new customClass(data, appInfo, hostApp, env);
        } else {
            return new Application(data, appInfo, hostApp, env);
        }
    }

    constructor(data, appInfo, hostApp, env) {
        super(data);
        if (!hostApp) throw new Error('no hostApp');
        if (!env) throw new Error('no env');
        this.appInfo            = appInfo;
        this.hostApp            = hostApp;
        this.env                = env;
        this.fillCollections    = ['databases', 'dataSources'];

        this.databases          = [];
        this.dataSources        = [];
        this.pages              = {};
        this.css                = [];
        this.js                 = [];

    }

    async init() {
        // await super.init();
        await this.createColItems('databases');
        await this.createColItems('dataSources');
        this.css = await Helper.getFilePaths(this.getDirPath(), 'build', 'css');
        this.js  = await Helper.getFilePaths(this.getDirPath(), 'build', 'js');
    }

    async deinit() {
        console.log('Application.deinit: ' + this.getName());

        // databases
        for (const database of this.databases) {
            await database.deinit();
        }
    }

    getDirPath() {
        return this.appInfo.dirPath;
    }

    getText() {
        return qforms.text[this.getAttr('lang') || 'en'];
    }

    async fill(context) {
        // console.log('Application.fill');
        const response = await super.fill(context);
        delete response.user;
        delete response.password;
        delete response.authentication;
        delete response.formatVersion;

        // env
        response.env = this.hostApp.nodeEnv;

        // text
        response.text = this.getText();

        // params
        // response.params = Application.getParams(context);

        // menu
        response.menu = await this.createMenu(context);

        // pages
        response.pages = await this.fillStartupPages(context);

        // await this.fillCollection2(response, 'databases', context);

        return response;
    }

    async createMenu(context) {
        const menu = {};
        const pageLinkNames = this.getItemNames('pageLinks').filter(pageLinkName => {
            return context.user ? this.authorizePage(context.user, pageLinkName) : true;
        });
        for (let i = 0; i < pageLinkNames.length; i++) {
            const pageLinkName = pageLinkNames[i];
            const pageLink = this.createPageLink(pageLinkName);
            const pageLinkMenu = pageLink.getAttr('menu');
            if (pageLinkMenu) {
                const pageFilePath = path.join(this.getDirPath(), pageLink.getAttr('fileName'));
                const pageFile = new qforms.JsonFile(pageFilePath);
                await pageFile.read();
                if (!menu[pageLinkMenu]) {
                    menu[pageLinkMenu] = [];
                }
                menu[pageLinkMenu].push({
                    page   : pageLink.getAttr('name'),
                    caption: pageFile.getAttr('caption')
                });
            }
        }
        return menu;
    }

    createPageLink(name) {
        return new PageLink(this.getColItemData('pageLinks', name), this);
    }

    createDatabase(name) {
        const data = this.getColItemData('databases', name);
        return Database.create(data, this);
    }

    async createPage(pageLinkName) {
        // console.log('Application.createPage', pageLinkName);
        const relFilePath  = this.createPageLink(pageLinkName).getAttr('fileName');
        const pageFilePath = path.join(this.getDirPath(), relFilePath);
        const content = await Helper.readTextFile(pageFilePath);
        const data = JSON.parse(content);
        const page = await qforms.Page.create(data, this);
        await page.init();
        return page;
    }

    authorizePage(user, pageName) {
        return true;
    }

    async getPage(context, pageLinkName) {
        // console.log('Application.getPage', pageLinkName);
        if (context.user && this.authorizePage(context.user, pageLinkName) === false) {
            throw new Error('authorization error');
        }
        if (this.pages[pageLinkName]) {
            return this.pages[pageLinkName];
        }
        return this.pages[pageLinkName] = await this.createPage(pageLinkName);
    }

    getStartupPageLinkNames() {
        return this.getDataCol('pageLinks')
            .filter(data => BaseModel.getAttr(data, 'startup') === 'true')
            .map(data => BaseModel.getName(data));
    }

    async fillStartupPages(context) {
        console.log('Application.fillStartupPages', context.query.page);
        const pages = [];
        if (context.query.page) {
            const page = await this.getPage(context, context.query.page);
            const response = await page.fill(context);
            pages.push(response);
        } else {
            for (const pageLinkName of this.getStartupPageLinkNames()) {
                const page = await this.getPage(context, pageLinkName);
                const response = await page.fill(context);
                pages.push(response);
            }
        }
        return pages;
    }

    async authenticate(context, username, password) {
        return username === this.getAttr('user') && password === this.getAttr('password');
    }

    authentication() {
        return this.getAttr('authentication') === 'true';
    }

    async getUsers(context) {
        return null;
    }

    static getParams(context) {
        // console.log('Application.getParams:', context.query);
        return {
            ...context.query,
            ...context.params,
            ...(context.querytime ? context.querytime.params : {}),
            ...(context.user ? {username: context.user.name} : {})
        };
    }

    async rpc(name, context) {
        console.log('Application.rpc', name);
        if (this[name]) return await this[name](context);
        return {errorMessage: `no rpc ${name}`};
    }

    async request(options) {
        console.warn('Application.request', options);
        return await axios(options);
    }

    getEnv() {
        return this.env;
    }

    getEnvVarValue(name) {
        // console.log(`Application.getEnvVarValue: ${name}`);
        if (!name) throw new Error('no name');
        const env = this.getEnv();
        const obj = this.data.env[env];
        if (!obj) throw new Error(`no env ${env}`);
        if (obj[name]) return obj[name];
        throw new Error(`no env ${name} in ${env}`);
    }

    getApp() {
        return this;
    }

    getDatabase(name) {
        if (!name) throw new Error('getDatabase: no name');
        const database = this.databases.find(database => database.getName() === name);
        if (!database) throw new Error(`no database with name: ${name}`);
        return database;
    }

    getTitle(context, data) {
        if (context.query.page) {
            const page = this.pages[context.query.page];
            if (!page) throw new Error(`no page: ${context.query.page}`);
            return page.getTitle();
        }
        return `${context.appDirName}/${context.appFileName}[${this.getEnv()}]`;
    }
}

module.exports = Application;
