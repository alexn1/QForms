import { Model } from '../Model';
import Column = require('../Column/Column');
import Application = require('../Application/Application');
declare class Table extends Model {
    columns: Column[];
    constructor(data: any, parent: any);
    static create(data: any, parent: any): Promise<Table>;
    init(context: any): Promise<void>;
    getKeyColumns(): string[];
    getApp(): Application;
    getColumn(name: any): Column;
    fillAttributes(response: any): void;
}
export = Table;
