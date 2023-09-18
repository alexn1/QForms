import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { Context } from '../Context';
import { BkHelper } from '../BkHelper';
import { BackHostApp } from '../BackHostApp';
import { BkApplication } from './BkModel/BkApplication/BkApplication';
import { HttpError } from '../HttpError';
import { BkModel } from './BkModel/BkModel';
import { Result } from '../../Result';
import { BkDataSource } from './BkModel/BkDataSource/BkDataSource';
import { Links } from '../Links';
import { Scripts } from '../Scripts';
import { Application } from '../../frontend/viewer/Model/Application/Application';
import { ApplicationController } from '../../frontend/viewer/Controller/ModelController/ApplicationController/ApplicationController';
import { login } from './login';
import { FrontHostApp } from '../../frontend/common';
import { NextFunction } from 'connect';
import { debug } from '../../console';
import { pConsole } from '../../pConsole';
import {
    Action,
    BaseDto,
    DeleteActionDto,
    InsertActionDto,
    LoginDto,
    Nullable,
    PageActionDto,
    PageActionQuery,
    PageActionResponse,
    RpcActionDto,
    SelectActionDto,
    SelectActionQuery,
    SelectActionResponse,
    UpdateActionDto,
} from '../../types';
import { Session_deleteUser, Session_save } from '../Session';
import { application } from 'express';
import { BkApplicationController } from './BkController/BkApplicationController';
import { BkPageController } from './BkController/BkPageController';
import { BkDataSourceController } from './BkController/BkDataSourceController';

const pkg = require('../../../package.json');

// to compile without using
export {
    TableForm,
    NoSqlDataSource,
    TextBoxField,
    TableFormTextBoxFieldController,
    RowForm,
} from '../../frontend/viewer';

// post actions
/* const ACTIONS = [
    'insert', // insert     create
    'select', // select     read
    'update', // update     update
    '_delete', // delete    delete
    'page',
    'rpc',
    'logout',
    'test',
]; */

export class ViewerModule {
    private css: string[];
    private js: string[];
    private applicationController: BkApplicationController;
    private pageController: BkPageController;
    private dataSourceController: BkDataSourceController;

    constructor(private hostApp: BackHostApp) {}

    async init() {
        // debug('ViewerModule.init', 'getFrontendDirPath:', this.hostApp.getFrontendDirPath());
        await this.initCss();
        await this.initJs();
        this.initControllers();
    }

    initControllers() {
        this.applicationController = new BkApplicationController(this);
        this.pageController = new BkPageController();
        this.dataSourceController = new BkDataSourceController(this);
    }

    async initCss(): Promise<void> {
        this.css = (
            await BkHelper.getFilePaths(
                path.join(this.hostApp.getFrontendDirPath(), 'viewer/public'),
                'css',
            )
        ).map((path) => `/viewer/public/${path}`);
        debug('ViewerModule.css:', this.css);
    }

    async initJs() {
        this.js = (
            await BkHelper.getFilePaths(
                path.join(this.hostApp.getFrontendDirPath(), 'viewer/public'),
                'js',
            )
        ).map((path) => `/viewer/public/${path}`);
        if (!this.js.length) throw new Error('no qforms js');
        debug('ViewerModule.js:', this.js);
    }

    getLinks(): string[] {
        return this.css;
    }

    getScripts(): string[] {
        return this.js;
    }

    async handleGet(context: Context, bkApplication: BkApplication): Promise<void> {
        pConsole.debug(
            'ViewerModule.handleGet',
            context.getDomain(),
            context.getReq()!.url,
            context.getReq()!.params,
            context.getQuery(),
            // Object.keys(context.query).map((name) => typeof context.query[name]),
        );

        const session = context.getSession();

        if (
            bkApplication.isAuthentication() &&
            !(session.user && session.user[context.getRoute()])
        ) {
            await this.applicationController.loginGet(context, bkApplication);
        } else {
            context.setVersionHeaders(pkg.version, bkApplication.getVersion());

            // handle actions
            const action = context.getAction();
            if (action === 'page') {
                await this.pageController.page(context, bkApplication);
            } else if (action === 'select') {
                await this.dataSourceController.select(context, bkApplication);
            } else {
                await this.applicationController.index(context, bkApplication);
            }
        }
    }

    async handlePost(context: Context, application: BkApplication): Promise<void> {
        // debug('ViewerModule.handlePost');
        const { action } = context.getBody() as BaseDto;
        if (action === 'login') {
            await this.applicationController.loginPost(context, application);
        } else {
            const user = context.getUser();
            if (application.isAuthentication() && !user) {
                throw new HttpError({ message: 'Unauthorized', status: 401, context });
            }

            await this.handleAction(context, application);
        }
    }

    async handlePatch(context: Context, application: BkApplication): Promise<void> {
        // debug('ViewerModule.handlePatch');
        const user = context.getUser();
        if (application.isAuthentication() && !user) {
            throw new HttpError({ message: 'Unauthorized', status: 401, context });
        }

        await this.handleAction(context, application);
    }

    async handleDelete(context: Context, application: BkApplication): Promise<void> {
        // debug('ViewerModule.handleDelete');
        const user = context.getUser();
        if (application.isAuthentication() && !user) {
            throw new HttpError({ message: 'Unauthorized', status: 401, context });
        }

        await this.handleAction(context, application);
    }

    async handleAction(context: Context, application: BkApplication) {
        const action = context.getAction();
        if (!action) throw new Error('no action');
        /* if (ACTIONS.indexOf(action) === -1) {
            throw new Error(`unknown action: ${action}`);
        } */
        context.setVersionHeaders(pkg.version, application.getVersion());
        if (action === 'page') {
            await this.pageController.page(context, application);
        } else if (action === 'logout') {
            await this.applicationController.logout(context, application);
        } else if (action === 'select') {
            await this.dataSourceController.select(context, application);
        } else if (action === 'rpc') {
            await this.applicationController.rpc(context, application);
        } else if (action === 'insert') {
            await this.dataSourceController.insert(context, application);
        } else if (action === 'update') {
            await this.dataSourceController.update(context, application);
        } else if (action === '_delete') {
            await this.dataSourceController._delete(context, application);
        } else {
            throw new Error(`unknown action: ${action}`);
            // await (this as any)[action](context, application);
        }
    }

    // action
    /* async test(context: Context, application: BkApplication) {
        debug('ViewerModule.test', context.getReq()!.body);
        // const result = await Test[req.body.name](context, application);
        // if (result === undefined) throw new Error('test action: result is undefined');
        context.getRes().json(null);
    } */

    async handleGetFile(context: Context, application: BkApplication, next: NextFunction) {
        await application.handleGetFile(context, next);
    }

    getHostApp() {
        return this.hostApp;
    }
}
