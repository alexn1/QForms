import { Model } from '../Model';
import { Form } from '../Form/Form';
import { Key } from '../../../../types';
export declare class Page extends Model {
    options: any;
    dataSources: any[];
    forms: Form[];
    params: any;
    constructor(data: any, parent: any, options: any);
    init(): void;
    deinit(): void;
    getOptions(): any;
    createForms(): void;
    deinitForms(): void;
    getParams(): any;
    setParam(name: string, value: any): void;
    update(): Promise<void>;
    discard(): void;
    getKey(): Key;
    hasRowFormWithDefaultDs(): boolean;
    hasRowFormWithDefaultSqlDataSource(): boolean;
    hasRowForm(): boolean;
    hasTableForm(): boolean;
    isNewMode(): boolean;
    hasNew(): boolean;
    getApp(): any;
    isModal(): boolean;
    onFormInsert(e: any): void;
    rpc(name: any, params: any): Promise<any>;
    getForm(name: any): Form;
    isSelectMode(): boolean;
    isFormInTab(): boolean;
}
