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
export declare class BkApplication<THostApp extends BackHostApp = BackHostApp> extends BkModel {
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
    scripts: any[];
    menu: any;
    nav: any;
    clients: any[];
    constructor(appInfo: AppInfo, hostApp: THostApp, env?: string);
    init(context: Context): Promise<void>;
    getHostApp(): THostApp;
    getLinks(context: Context): Promise<any[]>;
    getScripts(context: Context): Promise<any[]>;
    deinit(): Promise<void>;
    getDirPath(): string;
    getDistDirPath(): string;
    getPublicDirPath(): string;
    getText(): any;
    getVersion(): string;
    fillAttributes(response: any): void;
    fill(context: Context): Promise<any>;
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
    getUsers(context: Context): Promise<any>;
    rpc(name: string, context: Context): Promise<any>;
    getEnv(): string;
    getEnvVarValue(name: string): any;
    getApp(): BkApplication;
    findDatabase(name: string): BkDatabase | undefined;
    getDatabase(name: string): BkDatabase;
    initContext(context: Context): Promise<void>;
    static makeAppInfoFromAppFile(appFile: JsonFile, distDirPath?: string): AppInfo;
    static loadAppInfo(appFilePath: string, distDirPath: string | null): Promise<AppInfo>;
    static getAppInfos(appsDirPath: string, distDirPath: string): Promise<AppInfo[]>;
    getDataSource(name: string): BkDataSource;
    getViewClassName(): string;
    connect(context: Context): Promise<void>;
    release(context: any): Promise<void>;
    addClient(webSocket: any): void;
    removeClient(webSocket: any): void;
    broadcastDomesticResultToClients(context: Context, result: Result): void;
    broadcastForeignResultToClients(context: Context, result: Result): void;
    composeForeignResult(result: Result): Result;
    getTitle(context: Context): string;
    getLoginViewClassName(): string;
    isAvailable(): boolean;
    handleGetFile(context: Context, next: any): Promise<void>;
    renderIndexHtml(context: Context, applicationController: ApplicationController, qformsVersion: string, links: string, scripts: string, data: string, appViewHtml: string): string;
}
