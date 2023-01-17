import { Result } from '../../../Result';
import { Model } from '../Model';
import { Context } from '../../../Context';
import { Application } from '../Application/Application';
import { Database } from '../Database/Database';
import { Form } from '../Form/Form';
export declare class DataSource extends Model {
    keyColumns: any;
    rows: any[];
    constructor(data: any, parent: any);
    getDirPath(): string;
    getJsonFilePath(): string;
    init(context: any): Promise<void>;
    getKeyColumns(): string[];
    prepareRows(context: Context, rows: any[]): void;
    checkColumns(row: any): void;
    encodeRows(rows: any): void;
    encodeRow(row: any): void;
    getApp(): Application;
    getKeyValuesFromKey(key: any): {};
    getKeyFromValues(values: any): string;
    getFullName(): string;
    static keyToParams(key: any, paramName?: string): {};
    calcNewKeyValues(originalKeyValues: any, values: any): any;
    calcNewKey(key: any, values: any): string;
    fillAttributes(response: any): void;
    fill(context: Context): Promise<any>;
    getRows(): Promise<any[]>;
    isOnForm(): boolean;
    isDefaultOnForm(): boolean;
    isDefaultOnRowForm(): boolean;
    isDefaultOnTableForm(): boolean;
    getDatabase(): Database;
    insert(context: Context, _values?: any): Promise<Result>;
    update(context: Context): Promise<Result>;
    delete(context: Context): Promise<Result>;
    getForm(): Form;
}
