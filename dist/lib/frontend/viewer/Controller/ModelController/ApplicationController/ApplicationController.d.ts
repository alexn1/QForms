import { ModelController } from '../ModelController';
export declare class ApplicationController extends ModelController {
    frontHostApp: any;
    lastId: number;
    activePage: any;
    modals: any[];
    statusbar: any;
    homePageName: string | null;
    webSocketClient: any;
    view: any;
    constructor(model: any, frontHostApp: any);
    static create(model: any, frontHostApp: any): any;
    static isDebugMode(): boolean;
    init(): void;
    deinit(): void;
    getViewClass(): any;
    createView(rootElement: any): void;
    onRequest: (e: any) => Promise<void>;
    createVersionNotificationIfNotExists(): void;
    getGlobalParams(): {};
    createPage(pageData: any, options: any): any;
    openPage(options: any): Promise<any>;
    addModal(ctrl: any): void;
    removeModal(ctrl: any): void;
    getNextId(): number;
    getNewId(): string;
    addPage(pc: any): void;
    findPageControllerByPageNameAndKey(pageName: any, key: any): any;
    onPageSelect(pc: any): void;
    closePage(pageController: any): Promise<void>;
    onActionClick(name: any): Promise<any>;
    getMenuItemsProp(): {
        name: string;
        title: string;
        items: any;
    }[];
    onStatusbarCreate: (statusbar: any) => void;
    onLogout: () => Promise<void>;
    onMenuItemClick: (menu: any, type: any, name: any) => Promise<void>;
    getActivePageName(): any;
    onWindowPopState(e: any): Promise<void>;
    getTitle(): any;
    invalidate(): void;
    alert(options: any): Promise<any>;
    confirm(options: any): Promise<any>;
    getRootPath(): string;
    openModal(ctrl: any): Promise<void>;
    closeModal(ctrl: any): Promise<void>;
    getHostApp(): any;
    connect(): Promise<void>;
    rpc(name: any, params: any): Promise<any>;
    getDomain(): any;
    getBaseUrl(): string;
}
