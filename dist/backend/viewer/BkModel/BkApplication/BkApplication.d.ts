import { WebSocket } from 'ws';
import { AppInfo } from '../../../AppInfo';
import { BackHostApp } from '../../../BackHostApp';
import { BkModel } from '../BkModel';
import { BkAction } from '../BkAction/BkAction';
import { BkDatabase } from '../BkDatabase/BkDatabase';
import { BkDataSource } from '../BkDataSource/BkDataSource';
import { BkPage } from '../BkPage/BkPage';
import { BkPageLink } from '../BkPageLink/BkPageLink';
import { Context } from '../../../Context';
import { JsonFile } from '../../../JsonFile';
import { Result } from '../../../../Result';
import { ApplicationController } from '../../../../frontend/viewer/Controller/ModelController/ApplicationController/ApplicationController';
import { ApplicationData } from '../../../../common/data';
import { BkApplicationScheme } from '../../BkModelScheme/BkApplicationScheme/BkApplicationScheme';
import { NextFunction } from 'express';
export declare class BkApplication<THostApp extends BackHostApp = BackHostApp> extends BkModel<BkApplicationScheme> {
    private appInfo;
    private hostApp;
    private env;
    databases: BkDatabase[];
    actions: BkAction[];
    dataSources: BkDataSource[];
    pages: {
        [pageLinkName: string]: BkPage;
    };
    links: any[];
    scripts: string[];
    menu: Record<string, any[]>;
    nav: Record<string, any[]>;
    clients: WebSocket[];
    constructor(appInfo: AppInfo, hostApp: THostApp, env?: string);
    init(context: Context): Promise<void>;
    getHostApp(): THostApp;
    getLinks(context: Context): Promise<any[]>;
    getScripts(context: Context): Promise<string[]>;
    deinit(): Promise<void>;
    getDirPath(): string;
    getDistDirPath(): string | undefined;
    getPublicDirPath(): string;
    getText(): any;
    getVersion(): string | null;
    fillAttributes(response: ApplicationData): void;
    fill(context: Context): Promise<ApplicationData>;
    getClientUserFromServerUser(context: Context): Promise<any>;
    createMenu(context: Context): Promise<void>;
    createPageLink(name: string): BkPageLink;
    createPage(pageLinkName: string): Promise<BkPage>;
    authorizePage(user: any, pageName: string): boolean;
    getPage(context: Context, pageLinkName: string): Promise<BkPage>;
    getStartupPageLinkNames(): string[];
    fillPages(context: Context): Promise<any[]>;
    authenticate(context: Context, username: string, password: string): Promise<any>;
    isAuthentication(): boolean;
    getUsers(context: Context): Promise<null>;
    rpc(name: string, context: Context): Promise<any>;
    getEnv(): string;
    getEnvVarValue(name: string): any;
    getApp(): BkApplication;
    findDatabase(name: string): BkDatabase | undefined;
    getDatabase(name: string): BkDatabase;
    initContext(context: Context): Promise<void>;
    static makeAppInfoFromAppFile(appFile: JsonFile, distDirPath?: string): AppInfo;
    static loadAppInfo(appFilePath: string, distDirPath?: string): Promise<AppInfo>;
    static getAppInfos(appsDirPath: string, distDirPath: string): Promise<AppInfo[]>;
    findDataSource(name: string): BkDataSource | undefined;
    getDataSource(name: string): BkDataSource;
    getViewClassName(): string;
    connect(context: Context): Promise<void>;
    release(context: Context): Promise<void>;
    addClient(webSocket: WebSocket): void;
    removeClient(webSocket: WebSocket): void;
    broadcastDomesticResultToClients(context: Context, result: Result): void;
    broadcastForeignResultToClients(context: Context, result: Result): void;
    composeForeignResult(result: Result): Result | null;
    getTitle(context: Context): string;
    getLoginViewClassName(): string;
    isAvailable(): boolean;
    handleGetFile(context: Context, next: NextFunction): Promise<void>;
    renderIndexHtml(context: Context, applicationController: ApplicationController, qformsVersion: string, links: string, scripts: string, data: ApplicationData, appViewHtml: string): string;
    static getEnvList(data: BkApplicationScheme): string[];
}
