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
import { ApplicationData } from '../../../../common/ModelData/ApplicationData';
import { ApplicationScheme } from '../../../common/Scheme/ApplicationScheme';
import { NextFunction } from 'express';
import { Link, Nullable, ClientUser } from '../../../../types';
import { PageData } from '../../../../common/ModelData/PageData';
export interface ServerUser {
    id: number;
    name: string;
}
export declare class BkApplication<THostApp extends BackHostApp = BackHostApp> extends BkModel<ApplicationScheme> {
    private appInfo;
    private hostApp;
    private env;
    databases: BkDatabase[];
    actions: BkAction[];
    dataSources: BkDataSource[];
    pages: {
        [pageLinkName: string]: BkPage;
    };
    links: Array<Link | string>;
    scripts: string[];
    menu: Record<string, any[]>;
    nav: Record<string, any[]>;
    clients: WebSocket[];
    constructor(appInfo: AppInfo, hostApp: THostApp, env?: string);
    init(context: Context): Promise<void>;
    getHostApp(): THostApp;
    findLinks(context: Context): Promise<Array<Link | string>>;
    findScripts(context: Context): Promise<string[]>;
    deinit(): Promise<void>;
    getDirPath(): string;
    getPublicDirPath(): string;
    getText(): any;
    getVersion(): string | null;
    fillAttributes(response: ApplicationData): void;
    fill(context: Context): Promise<ApplicationData>;
    getClientUserFromServerUser(context: Context): Promise<ClientUser>;
    createMenu(ctx: Context): Promise<void>;
    createPageLink(name: string): BkPageLink;
    createPageIfNotExists(context: Context, pageName: string): Promise<BkPage>;
    authorizeUser(context: Context, pageName: string): void;
    authorizePage(user: ServerUser, pageName: string): boolean;
    createPage(context: Context, pageName: string): Promise<BkPage>;
    getPage(name: string): BkPage;
    getStartupPageLinkNames(): string[];
    getPageLinksToFill(context: Context): string[];
    fillPages(context: Context): Promise<PageData[]>;
    authenticate(ctx: Context, username: string, password: string): Promise<Nullable<ServerUser>>;
    isAuthentication(): boolean;
    getUsers(context: Context): Promise<null>;
    rpc(name: string, context: Context): Promise<any>;
    getEnv(): string;
    getApp(): BkApplication;
    findDatabase(name: string): BkDatabase | undefined;
    getDatabase(name: string): BkDatabase;
    initContext(context: Context): Promise<void>;
    static makeAppInfoFromAppFile(appFile: JsonFile): AppInfo;
    static loadAppInfo(appFilePath: string): Promise<AppInfo>;
    static getAppInfos(srcDirPath: string): Promise<AppInfo[]>;
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
    static getEnvList(data: ApplicationScheme): string[];
    renderIndexResponse(context: Context): Promise<[contentType: string, response: string]>;
    renderHtml(context: Context): Promise<string>;
    createFrontApplicationController(context: Context, data: ApplicationData): ApplicationController;
    getLinks(): (string | Link)[];
    getScripts(): string[];
}
