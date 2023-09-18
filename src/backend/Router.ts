import { NextFunction, Request, Response } from 'express';
import colors from 'colors/safe';
import { BackHostApp } from './BackHostApp';
import { pConsole } from '../pConsole';
import { Nullable, Scalar } from '../types';

export type Route = [
    module: 'viewer' | 'editor',
    appDirName: string,
    appFileName: string,
    env: string,
    domain?: string,
];

export class Router {
    constructor(private hostApp: BackHostApp) {}

    createRoutes() {
        if (this.hostApp.isDevelopment()) {
            // google chrome always redirect from /index to /index/ even with disabled cache
            // so we use /index2
            this.hostApp.getExpress().get('/index2', this.hostApp.indexModule.get.bind(this));
            this.hostApp.getExpress().post('/index2', this.hostApp.indexModule.post.bind(this));
        }

        // monitor module
        this.hostApp.getExpress().get('/monitor', this.hostApp.monitorModule.get.bind(this));

        // GET
        this.hostApp
            .getExpress()
            .get('/:module/:appDirName/:appFileName/:env/:domain/', this.moduleGet.bind(this));

        // POST
        this.hostApp
            .getExpress()
            .post('/:module/:appDirName/:appFileName/:env/:domain/', this.modulePost.bind(this));

        // PATCH
        this.hostApp
            .getExpress()
            .patch('/:module/:appDirName/:appFileName/:env/:domain/', this.modulePatch.bind(this));

        // DELETE
        this.hostApp
            .getExpress()
            .delete(
                '/:module/:appDirName/:appFileName/:env/:domain/',
                this.moduleDelete.bind(this),
            );
    }

    async moduleGet(req: Request, res: Response, next: NextFunction): Promise<void> {
        // @ts-ignore
        // pConsole.debug(colors.magenta.underline('Router.moduleGet'), req.params);
        pConsole.log(
            // @ts-ignore
            colors.magenta.underline('GET'),
            `${req.params.module}/${req.params.appDirName}/${req.params.appFileName}/${req.params.env}/${req.params.domain}`,
        );
        if (req.params.module === 'viewer') {
            await this.hostApp.viewerModule.get(req, res, next);
        } else if (req.params.module === 'editor' && this.hostApp.isDevelopment()) {
            await this.hostApp.editorModule.get(req, res, next);
        } else {
            next();
        }
    }

    async modulePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        // @ts-ignore
        pConsole.debug(colors.magenta.underline('Router.modulePost'), req.params, req.body);

        // log request
        pConsole.log(
            // @ts-ignore
            colors.magenta.underline('POST'),
            `${req.params.module}/${req.params.appDirName}/${req.params.appFileName}/${req.params.env}/${req.params.domain}`,
            `${req.body.page}.${req.body.form}.${req.body.ds}.${req.body.action}`,
        );

        if (req.params.module === 'viewer') {
            await this.hostApp.viewerModule.post(req, res, next);
        } else if (req.params.module === 'editor' && this.hostApp.isDevelopment()) {
            await this.hostApp.editorModule.post(req, res, next);
        } else {
            next();
        }
    }

    async modulePatch(req: Request, res: Response, next: NextFunction): Promise<void> {
        // @ts-ignore
        pConsole.debug(colors.magenta.underline('BackHostApp.modulePatch'), req.params, req.body);

        // log request
        pConsole.log(
            // @ts-ignore
            colors.magenta.underline('PATCH'),
            `${req.params.module}/${req.params.appDirName}/${req.params.appFileName}/${req.params.env}/${req.params.domain}`,
            `${req.body.page}.${req.body.form}.${req.body.ds}.${req.body.action}`,
        );

        if (req.params.module === 'viewer') {
            await this.hostApp.viewerModule.patch(req, res, next);
        } else {
            next();
        }
    }

    async moduleDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
        // @ts-ignore
        pConsole.debug(colors.magenta.underline('BackHostApp.moduleDelete'), req.params, req.body);

        // log request
        pConsole.log(
            // @ts-ignore
            colors.magenta.underline('DELETE'),
            `${req.params.module}/${req.params.appDirName}/${req.params.appFileName}/${req.params.env}/${req.params.domain}`,
            `${req.body.page}.${req.body.form}.${req.body.ds}.${req.body.action}`,
        );

        if (req.params.module === 'viewer') {
            await this.hostApp.viewerModule.delete(req, res, next);
        } else {
            next();
        }
    }

    alias(
        method: 'get' | 'post' | 'patch' | 'delete',
        path: string | RegExp,
        [module, appDirName, appFileName, env, domain]: Route,
        fn: 'moduleGet' | 'modulePost' | 'modulePatch' | 'moduleDelete',
        query?: Record<string, Nullable<Scalar>>,
    ) {
        this.hostApp
            .getExpress()
            [method](path, async (req: Request, res: Response, next: NextFunction) => {
                req.params.module = module;
                req.params.appDirName = appDirName;
                req.params.appFileName = appFileName;
                if (env) {
                    req.params.env = env;
                }
                if (domain) {
                    req.params.domain = domain;
                }
                if (query) {
                    const params = BackHostApp.getQueryFromParams(req, query);
                    for (const name in params) {
                        if (!req.query[name]) {
                            req.query[name] = params[name];
                        }
                    }
                }
                // @ts-ignore
                await this[fn](req, res, next);
            });
    }
}
