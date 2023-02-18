import { AppInfo } from '../../../AppInfo';
import { BackHostApp } from '../../../BackHostApp';
import { BkModel } from '../BkModel';
import { BkAction } from '../BkAction/BkAction';
import { BkDatabase } from '../Database/Database';
import { BkDataSource } from '../BkDataSource/BkDataSource';
import { BkPage } from '../Page/Page';
import { BkPageLink } from '../PageLink/PageLink';
import { Context } from '../../../Context';
import { JsonFile } from '../../../JsonFile';
import { Result } from '../../../../Result';
export declare class BkApplication extends BkModel {
    appInfo: AppInfo;
    hostApp: BackHostApp;
    env: string;
    databases: BkDatabase[];
    actions: BkAction[];
    dataSources: BkDataSource[];
    pages: any;
    links: any[];
    scripts: any[];
    menu: any;
    nav: any;
    clients: any[];
    constructor(data: any, appInfo: AppInfo, hostApp: BackHostApp, context: Context);
    init(context: Context): Promise<void>;
    getHostApp(): BackHostApp;
    getLinks(context: Context): Promise<any[]>;
    getScripts(context: Context): Promise<any[]>;
    deinit(): Promise<void>;
    getDirPath(): string;
    getDistDirPath(): string | null;
    getPublicDirPath(): string;
    getText(): any;
    getVersion(): string | null;
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
    findDatabase(name: string): BkDatabase;
    getDatabase(name: string): BkDatabase;
    initContext(context: Context): Promise<void>;
    static makeAppInfoFromAppFile(appFile: JsonFile, hostApp: BackHostApp): AppInfo;
    static loadAppInfo(appFilePath: string, hostApp: BackHostApp): Promise<AppInfo>;
    static getAppInfos(appsDirPath: string, hostApp: BackHostApp): Promise<AppInfo[]>;
    getDataSource(name: string): BkDataSource | undefined;
    getViewClassName(): string;
    connect(context: Context): Promise<void>;
    release(context: any): Promise<void>;
    addClient(webSocket: any): void;
    removeClient(webSocket: any): void;
    broadcastDomesticResultToClients(context: Context, result: Result): void;
    broadcastForeignResultToClients(context: Context, result: Result): void;
    composeForeignResult(result: Result): Result | null;
    getTitle(context: Context): string;
    getLoginViewClassName(): string;
    isAvailable(): boolean;
    handleGetFile(context: Context, next: any): Promise<void>;
}
