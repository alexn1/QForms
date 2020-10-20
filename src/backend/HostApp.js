'use strict';

const fs      = require('fs');
const path    = require('path');
const qforms  = require('./qforms');
const Context = require('./Context');
const Test    = require('./Test');
const pkg     = require('../../package.json');
const Helper  = require('./common/Helper');

// post actions
const ACTIONS = [
    'page',
    'select',        // select
    'selectSingle',
    'selectMultiple',
    'insert',       // insert
    'update',       // update
    '_delete',      // delete
    'rpc',
    'logout',
    'test'
];

const EDITOR_CONTROLLERS = [
    'Application',
    'Database'   ,
    'DataSource' ,
    'Field'      ,
    'Control'    ,
    'Form'       ,
    'KeyColumn'  ,
    'Page'       ,
    'PageLink'   ,
    'Param'      ,
    'ParentKeyColumn',
    'Table',
    'Column',
    'Action'
];

const EDITOR_ACTIONS = [
    'save'            ,
    '_new'            ,
    'delete'          ,
    'getView'         ,
    'saveView'        ,
    'saveController'  ,
    'createView'      ,
    'createController',
    'get'             ,
    'getTableInfo'    ,
    'changeClass'     ,
    'moveUp'          ,
    'moveDown'
];

class HostApp {
    constructor(server) {
        console.log('HostApp.constructor');
        this.server = server;
        this.applications  = {};
    }

    init() {
        const engineDirPath  = path.join(__dirname, '..');
        const backendDirPath = __dirname;
        const publicDirPath = path.join(engineDirPath,  'frontend');

        // environment
        const appsDirPath = Helper.getCommandLineParams().appsDirPath || pkg.config.appsDirPath;
        if (!fs.existsSync(appsDirPath)) {
            console.error(`Application folder '${path.resolve(appsDirPath)}' doesn't exist`);
            process.exit(1);
            return;
        }
        // vars
        // this.server.set('appsDirPath'    , appsDirPath);
        this.server.set('handleException', Helper.getCommandLineParams().handleException || true);
        this.server.set('view engine'    , 'ejs');
        this.server.set('views'          , path.join(backendDirPath, 'ejs'));
        this.server.set('runtime'        , path.join(engineDirPath,  'runtime'));
        this.server.set('temp'           , path.join(engineDirPath,  'runtime/temp'));
        this.server.enable('strict routing');

        this.publicDirPath = publicDirPath;
        this.appsDirPath  = appsDirPath;
        this.commonClassCss = Helper.getFilePathsSync(publicDirPath, 'common/class', 'css');
        this.commonClassJs = Helper.getFilePathsSync(publicDirPath, 'common/class', 'js' );
        this.homeClassCss = Helper.getFilePathsSync(publicDirPath, 'home/class'  , 'css');
        this.homeClassJs = Helper.getFilePathsSync(publicDirPath, 'home/class'  , 'js' );
        this.viewerClassCss = Helper.getFilePathsSync(publicDirPath, 'viewer/class', 'css');
        this.viewerClassJs = Helper.getFilePathsSync(publicDirPath, 'viewer/class', 'js' );
        this.editorClassCss = Helper.getFilePathsSync(publicDirPath, 'editor/class', 'css');
        this.editorClassJs = Helper.getFilePathsSync(publicDirPath, 'editor/class', 'js' );


        // production by default to disable editor
        /*if (!process.env.NODE_ENV) {
            server.set('env', 'production');
        }
        this.nodeEnv       = this.server.get('env');*/


        // nodeEnv
        this.nodeEnv = process.env.NODE_ENV;
        if (!this.nodeEnv) {
            this.nodeEnv = 'production';
        }
    }

    async createApplicationIfNotExists(req) {
        console.log(`HostApp.createApplicationIfNotExists debug: ${req.query.debug}, env: ${req.params.env}`);
        const route = HostApp.getRoute(req);
        const application = this.applications[route];
        if (application) {
            if (req.method === 'GET' && (req.query.debug === '1' || HostApp.isEditor(req))) {
                await application.deinit();
                return this.applications[route] = await this.createApplication(this.getAppFilePath(req), req.params.env);
            }
            return application;
        }
        return this.applications[route] = await this.createApplication(this.getAppFilePath(req), req.params.env);
    }

    getApplication(req) {
        const application = this.applications[HostApp.getRoute(req)];
        if (!application) throw new Error('no application');
        return application;
    }

    getAppFilePath(req) {
        return path.join(this.appsDirPath, req.params.appDirName, req.params.appFileName + '.json');
    }

    static getRoute(req) {
        return [req.params.appDirName, req.params.appFileName, req.params.env].join('/');
    }

    static isEditor(req) {
        return req.url.substr(0, 6) === '/edit/';
    }

    static isViewer(req) {
        return req.url.substr(0, 6) === '/view/';
    }

    async createApplication(appFilePath, env) {
        console.log(`HostApp.createApplication: ${appFilePath}`);
        const application = await qforms.Application.create(appFilePath, this, env);
        await application.init();
        return application;
    }

    async handleViewerGet(req, res, context) {
        console.log('HostApp.handleViewerGet');
        await this.createApplicationIfNotExists(req);
        const route = HostApp.getRoute(req);
        const application = this.getApplication(req);
        if (this.getApplication(req).authentication() && !(req.session.user && req.session.user[route])) {
            this.loginGet(req, res, context);
        } else {
            const data = await this.fill(req, context);
            res.render('viewer', {
                version       : pkg.version,
                debugApp      : req.query.debug,
                commonClassCss: this.commonClassCss,
                commonClassJs : this.commonClassJs,
                viewerClassCss: this.viewerClassCss,
                viewerClassJs : this.viewerClassJs,
                links         : application.css,
                caption       : `${req.params.appDirName}/${application.getAttr('caption')}`,
                data          : data,
                env           : application.getEnv()
            });
        }
    }

    async handleViewerPost(req, res, context) {
        console.log('HostApp.handleViewerPost');
        await this.createApplicationIfNotExists(req);
        const route = HostApp.getRoute(req);
        if (req.body.action === 'login') {
            this.loginPost(req, res, context);
        } else {
            if (this.getApplication(req).authentication() && !(req.session.user && req.session.user[route])) {
                throw new Error('not authenticated');
            }
            if (ACTIONS.indexOf(req.body.action) === -1) {
                throw new Error(`unknown action: ${req.body.action}`);
            }
            await this[req.body.action](req, res, context);
        }
    }

    async loginGet(req, res, context) {
        console.log('HostApp.loginGet');
        const application = this.getApplication(req);
        const users = await application.getUsers(context);
        res.render('login', {
            version       : pkg.version,
            application   : application,
            caption       : application.getAttr('caption'),
            REQUEST_URI   : req.url,
            errMsg        : null,
            username      : null,
            users         : users
        });
    }

    async loginPost(req, res, context) {
        console.log('HostApp.loginPost');
        const route = HostApp.getRoute(req);
        const application = this.getApplication(req);
        const authenticate = await application.authenticate(context, req.body.username, req.body.password);
        const user = null;
        if (authenticate) {
            if (req.session.user === undefined) {
                req.session.user = {};
            }
            if (user) {
                req.session.user[route] = user;
            } else {
                req.session.user[route] = {name: req.body.username};
            }
            res.redirect(req.url);
        } else {
            const users = await application.getUsers(context);
            res.render('login', {
                version    : pkg.version,
                application: application,
                caption    : application.getAttr('caption'),
                REQUEST_URI: req.url,
                errMsg     : application.text.login.WrongUsernameOrPassword,
                username   : req.body.username,
                users      : users
            });
        }
    }

    // fill application
    async fill(req, context) {
        console.log('HostApp.fill', this.getApplication(req).getName());
        const application = this.getApplication(req);
        const data = await application.fill(context);
        return data;
    }

    // action (fill page)
    async page(req, res, context) {
        console.log('HostApp.page', req.body.page);
        const application = this.getApplication(req);
        const page = await application.getPage(context, req.body.page);
        const data = await page.fill(context);
        await res.json({page: data});
    }

    // action
    async update(req, res, context) {
        console.log('HostApp.update', req.body.page);
        const page = await this.getApplication(req).getPage(context, req.body.page);
        const form = page.forms[req.body.form];
        const result = await form.update(context, req.body.ds);
        if (result === undefined) throw new Error('action update: result is undefined');
        await res.json(result);
    }

    // action
    async select(req, res, context) {
        console.log('HostApp.select', req.body.page);
        const start = Date.now();
        const application = this.getApplication(req);
        let dataSource;
        if (req.body.page) {
            const page = await application.getPage(context, req.body.page);
            if (req.body.form) {
                dataSource = page.forms[req.body.form].dataSources[req.body.ds];
            } else {
                dataSource = page.dataSources[req.body.ds];
            }
        } else {
            dataSource = application.dataSources[req.body.ds];
        }
        const [rows, count] = await dataSource.select(context);
        const time = Date.now() - start;
        console.log('select time:', time);
        await res.json({rows, count, time});
    }

    // action
    async selectSingle(req, res, context) {
        console.log('HostApp.selectSingle', req.body.page);
        const start = Date.now();
        const application = this.getApplication(req);
        let dataSource;
        if (req.body.page) {
            const page = await application.getPage(context, req.body.page);
            if (req.body.form) {
                dataSource = page.forms[req.body.form].dataSources[req.body.ds];
            } else {
                dataSource = page.dataSources[req.body.ds];
            }
        } else {
            dataSource = application.dataSources[req.body.ds];
        }
        const row = await dataSource.selectSingle(context);
        const time = Date.now() - start;
        console.log('select time:', time);
        await res.json({row, time});
    }

    // action
    async selectMultiple(req, res, context) {
        console.log('HostApp.selectMultiple', req.body.page);
        const start = Date.now();
        const application = this.getApplication(req);
        let dataSource;
        if (req.body.page) {
            const page = await application.getPage(context, req.body.page);
            if (req.body.form) {
                dataSource = page.forms[req.body.form].dataSources[req.body.ds];
            } else {
                dataSource = page.dataSources[req.body.ds];
            }
        } else {
            dataSource = application.dataSources[req.body.ds];
        }
        const [rows, count] = await dataSource.selectMultiple(context);
        const time = Date.now() - start;
        console.log('select time:', time);
        await res.json({rows, count, time});
    }

    // action
    async insert(req, res, context) {
        console.log('HostApp.insert', req.body.page);
        const page = await this.getApplication(req).getPage(context, req.body.page);
        const dataSource = page.forms[req.body.form].dataSources[req.body.ds];
        const cnn = await dataSource.database.getConnection(context);
        try {
            await dataSource.database.beginTransaction(cnn);
            const result = await dataSource.insert(context);
            if (result === undefined) throw new Error('insert: no data');
            await dataSource.database.commit(cnn);
            await res.json(result);
        } catch (err) {
            await dataSource.database.rollback(cnn, err);
            throw err;
        }
    }

    // action
    async _delete(req, res, context) {
        console.log('HostApp._delete', req.body.page);
        const page = await this.getApplication(req).getPage(context, req.body.page);
        const dataSource = page.forms[req.body.form].dataSources[req.body.ds];
        const cnn = await dataSource.database.getConnection(context);
        try {
            await dataSource.database.beginTransaction(cnn);
            await dataSource.delete(context);
            await dataSource.database.commit(cnn);
            await res.json(null);
        } catch (err) {
            await dataSource.database.rollback(cnn, err);
            throw err;
        }
    }

    // action
    async rpc(req, res, context) {
        console.log('HostApp.rpc', req.body);
        const application = this.getApplication(req);
        let model;
        if (req.body.page) {
            if (req.body.form) {
                const page = await application.getPage(context, req.body.page);
                model = page.forms[req.body.form];
            } else {
                model = await application.getPage(context, req.body.page);
            }
        } else {
            model = application;
        }
        const result = await model.rpc(context, req.body.name, req.body.params);
        await res.json(result);
    }

    // action
    async logout(req, res) {
        console.log('HostApp.logout');
        const route = HostApp.getRoute(req);
        if (req.session.user && req.session.user[route]) {
            delete req.session.user[route];
        }
        await res.json(null);
    }

    // action
    async test(req, res) {
        console.log('HostApp.test', req.body);
        const response = Test[req.body.name]();
        await res.json({
            action: 'test',
            name: req.body.name,
            response
        });
    }

    async appCssFile(req, application) {
        // console.log('HostApp.appCssFile');
        const relFilePath = req.params['0'];
        const filePath = path.join(application.appInfo.dirPath, relFilePath);
        if (path.extname(filePath) === '.css') {
            const exists = await qforms.Helper.exists(filePath);
            if (exists) {
                return await qforms.Helper.readFile(filePath);
            }
        }
        return null;
    }

    async viewerFile(req, res) {
        // console.log('HostApp.viewerFile');
        const application = this.getApplication(req);
        const content = await this.appCssFile(req, application);
        if (content !== null) {
            res.setHeader('content-type', 'text/css');
            res.send(content);
        } else {
            // console.error('file not found: ', req.originalUrl);
            const base = `/view/${req.params.appDirName}/${req.params.appFileName}/${req.params.env}`;
            const uri = req.originalUrl.replace(base, '');
            const filePath = path.join(this.publicDirPath, uri);
            res.sendFile(filePath);
        }
    }

    async editorFile(req, res) {
        // console.log('HostApp.editorFile', req.originalUrl);
        const application = this.getApplication(req);
        const content = await this.appCssFile(req, application);
        if (content !== null) {
            res.setHeader('content-type', 'text/css');
            res.send(content);
        } else {
            //console.error('file not found: ', req.originalUrl);
            const base = `/edit/${req.params.appDirName}/${req.params.appFileName}/${req.params.env}`;
            const uri = req.originalUrl.replace(base, '');
            const filePath = path.join(this.publicDirPath, uri);
            res.sendFile(filePath);
        }
    }

    async editorIndexGet(req, res) {
        console.log('HostApp.editorIndexGet');
        const application = await this.createApplicationIfNotExists(req);
        const appFile = new qforms.JsonFile(application.appInfo.filePath);
        await appFile.read();
        const app = JSON.parse(appFile.content);
        app.env = this.nodeEnv;
        const appFileContent = JSON.stringify(app, null, 4);
        res.render('editor', {
            version        : pkg.version,
            commonClassCss : this.commonClassCss,
            commonClassJs  : this.commonClassJs,
            editorClassCss : this.editorClassCss,
            editorClassJs  : this.editorClassJs,
            runAppLink     : `/view/${application.appInfo.route}/?debug=1`,
            appFileContent : appFileContent,
            appDirName     : req.params.appDirName,
            appName        : appFile.getAttr('name'),
            env            : application.getEnv()
        });
    }

    async editorPost(req, res) {
        console.log('HostApp.editorPost');
        const application = await this.createApplicationIfNotExists(req);
        const appInfo = application.appInfo;
        if (EDITOR_CONTROLLERS.indexOf(req.body.controller) === -1) {
            throw new Error(`unknown controller: ${req.body.controller}`);
        }
        if (EDITOR_ACTIONS.indexOf(req.body.action) === -1) {
            throw new Error(`unknown action ${req.body.action}`);
        }
        const controllerClassName = `qforms.${req.body.controller}EditorController`;
        const ControllerClass = eval(controllerClassName);
        if (!ControllerClass) throw new Error(`no class with name ${controllerClassName}`);
        const method = req.body.action;
        const ctrl = new ControllerClass(appInfo, this, application);
        if (!ctrl[method]) throw new Error(`no method: ${controllerClassName}.${method}`);
        const result = await ctrl[method](req.body.params);
        // console.log('json result:', result);
        if (result === undefined) throw new Error('result is undefined');
        await res.json(result);
    }

    async homePost(req, res) {
        console.log('HostApp.homePost');
        const appList = await this.createApp(req);
        await res.json({appList});
    }

    async createApp(req) {
        console.log('createApp');
        if (!req.body.folder) throw new Error('folder required: ' + req.body.folder);
        if (!req.body.name) throw new Error('name required: ' + req.body.name);
        const folder = req.body.folder;
        const name = req.body.name;
        const appDirPath  = path.join(this.appsDirPath, folder);
        const appFilePath = path.join(appDirPath,                 name + '.json');
        await qforms.Helper.createDirIfNotExists(appDirPath);
        await qforms.ApplicationEditor.createAppFile(appFilePath, {name});
        const appInfos = await qforms.Helper.getAppInfos(this.appsDirPath);
        return appInfos;
    }

    async homeGet(req, res) {
        console.log('HostApp.homeGet');
        const appInfos = await qforms.Helper.getAppInfos(this.appsDirPath);
        console.log('appInfos:', appInfos);
        res.render('home', {
            req           : req,
            hostApp       : this,
            version       : pkg.version,
            commonClassCss: this.commonClassCss,
            commonClassJs : this.commonClassJs,
            homeClassCss  : this.homeClassCss,
            homeClassJs   : this.homeClassJs,
            appInfos      : appInfos
        });
    }

    async monitorGet(req, res) {
        console.log('HostApp.monitorGet');
        res.render('monitor', {
            version     : pkg.version,
            applications: this.applications
        });
    }
    async logError(req, context, err) {
        try {
            const application = await this.createApplicationIfNotExists(req);
            await application.createLog(context, {
                type: 'error',
                source: 'server',
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                message: err.message,
                stack: err.stack.toString(),
                data: JSON.stringify(req.body, null, 4)
            });
        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = HostApp;
