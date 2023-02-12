import { Result } from '../../../Result';
import { Model } from '../Model';
import { Context } from '../../../Context';
import { BkApplication } from '../Application/Application';
import { Database } from '../Database/Database';
import { BkForm } from '../Form/Form';
export type ReadResult = [any[], number | null];
export declare class BkDataSource extends Model {
    keyColumns: string[];
    rows: any[];
    getDirPath(): string;
    getJsonFilePath(): string;
    init(context: Context): Promise<void>;
    getKeyColumns(): string[];
    prepareRows(context: Context, rows: any[]): void;
    checkColumns(row: any): void;
    encodeRows(rows: any[]): void;
    encodeRow(row: any): void;
    getApp(): BkApplication;
    getKeyValuesFromKey(key: string): {};
    getKeyFromValues(values: any): string;
    getFullName(): string;
    static keyToParams(key: string, paramName?: string): {};
    calcNewKeyValues(originalKeyValues: any, values: any): {};
    calcNewKey(key: string, values: any): string;
    fillAttributes(response: any): void;
    fill(context: Context): Promise<any>;
    private getRows;
    isOnForm(): boolean;
    isDefaultOnForm(): boolean;
    isDefaultOnRowForm(): boolean;
    isDefaultOnTableForm(): boolean;
    read(context: Context): Promise<ReadResult>;
    create(context: Context, _values?: any): Promise<Result>;
    update(context: Context): Promise<Result>;
    delete(context: Context): Promise<Result>;
    getForm(): BkForm | null;
    getAccess(context: Context): {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
    getDatabase(): Database;
    getLimit(): number;
}
