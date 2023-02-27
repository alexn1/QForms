import { ModelController } from '../ModelController';
import { FormController } from '../FormController/FormController';
import { PageView } from './PageView';
import { ApplicationController, OpenPageOptions } from '../ApplicationController/ApplicationController';
import { Page } from '../../../Model/Page/Page';
import { Form } from '../../../Model/Form/Form';
export declare class PageController extends ModelController<Page> {
    id: string;
    forms: FormController<Form>[];
    constructor(model: Page, parent: ApplicationController, id: string);
    static create(model: Page, parent: ApplicationController, id: string, options?: any): PageController;
    init(): void;
    deinit(): void;
    onSaveAndCloseClick: () => Promise<void>;
    onClosePageClick: (e: any) => Promise<void>;
    onOpenPageClick: (e: any) => Promise<void>;
    createOpenInNewLink(pageName: string, key: string): string;
    close(): Promise<void>;
    validate(): void;
    isValid(): boolean;
    onFormChange(e: any): Promise<void>;
    onFormDiscard(formController: FormController<Form>): void;
    onFormUpdate(e: any): void;
    onFormInsert(e: any): void;
    openPage(options: OpenPageOptions): Promise<PageController>;
    isChanged(): boolean;
    getApp(): ApplicationController;
    getViewClass(): typeof PageView;
    static createLink(params?: any): string;
    getForm(name: any): FormController<Form>;
    onActionClick(name: any): Promise<any>;
    onKeyDown: (e: any) => Promise<void>;
    getTitle(): string;
    getSelectedRowKey(): any;
    onSelectClick: (e: any) => Promise<void>;
    onResetClick: (e: any) => Promise<void>;
    selectRow(key: any): Promise<void>;
    invalidate(): void;
    getId(): string;
    isModal(): boolean;
    isAutoFocus(): boolean;
}
