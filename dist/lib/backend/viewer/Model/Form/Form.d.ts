import { Model } from '../Model';
import { DataSource } from '../DataSource/DataSource';
import { BkAction } from '../Action/Action';
import { Field } from '../Field/Field';
import { BkPage } from '../Page/Page';
import { Application } from '../Application/Application';
export declare class Form extends Model {
    dataSources: DataSource[];
    actions: BkAction[];
    fields: Field[];
    constructor(data: any, parent: any);
    init(context: any): Promise<void>;
    getDirPath(): string;
    fillAttributes(response: any): void;
    fill(context: any): Promise<any>;
    _getSurrogateDataSourceResponse(context: any): {
        class: string;
        name: string;
        keyColumns: string[];
        rows: {
            id: number;
        }[];
    };
    dumpRowToParams(row: any, params: any): void;
    replaceThis(context: any, query: any): any;
    rpc(name: any, context: any): Promise<any>;
    getApp(): Application;
    getPage(): BkPage;
    getFullName(): string;
    isNewMode(context: any): boolean;
    getField(name: any): Field | undefined;
    getDataSource(name: any): DataSource | undefined;
}
