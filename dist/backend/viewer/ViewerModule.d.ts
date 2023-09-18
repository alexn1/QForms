import { Request, Response, NextFunction } from 'express';
import { Context } from '../Context';
import { BackHostApp } from '../BackHostApp';
import { BkApplication } from './BkModel/BkApplication/BkApplication';
export declare class ViewerModule {
    private hostApp;
    private css;
    private js;
    private applicationController;
    private pageController;
    private dataSourceController;
    constructor(hostApp: BackHostApp);
    init(): Promise<void>;
    initCss(): Promise<void>;
    initJs(): Promise<void>;
    initControllers(): void;
    get(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleGet(context: Context, bkApplication: BkApplication): Promise<void>;
    handlePost(context: Context, application: BkApplication): Promise<void>;
    handlePatch(context: Context, application: BkApplication): Promise<void>;
    handleDelete(context: Context, application: BkApplication): Promise<void>;
    handleGetFile(context: Context, application: BkApplication, next: NextFunction): Promise<void>;
    checkAuthorization(context: Context, application: BkApplication): void;
    getHostApp(): BackHostApp;
    getLinks(): string[];
    getScripts(): string[];
}
