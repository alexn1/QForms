import { Model } from '../Model';
import { Form } from '../Form/Form';
import { Page } from '../Page/Page';
import { Application } from '../Application/Application';
import { Key, KeyRecord, RawRow, JSONString, ChangesByKey } from '../../../../types';
import { Result } from '../../../../Result';
import { DataSourceData } from '../../../../common/DataSourceData';
export declare class DataSource extends Model<DataSourceData> {
    rows: RawRow[] | null;
    rowsByKey: {
        [key: Key]: RawRow;
    } | null;
    news: RawRow[];
    changes: Map<RawRow, RawRow>;
    frame: number;
    count: number | null;
    lastFrame: number;
    constructor(data: any, parent: Model);
    init(): void;
    deinit(): void;
    setRows(rows: RawRow[]): void;
    addRow(row: RawRow): void;
    addRows(rows: RawRow[]): void;
    getRowsLength(): number;
    fillRowsByKey(): void;
    discardRowColumn(row: RawRow, column: string): void;
    changeRowColumn(row: RawRow, column: string, newValue: JSONString): void;
    setValue(row: RawRow, column: string, value: JSONString): void;
    isChanged(): boolean;
    hasNew(): boolean;
    isRowColumnChanged(row: RawRow, column: string): boolean;
    getValue(row: RawRow, column: string): JSONString;
    getKeyValues(row: RawRow): KeyRecord;
    getRowKey(row: RawRow): Key | null;
    removeRow(key: Key): void;
    newRow(row: RawRow): void;
    getSingleRow(withChanges?: boolean): RawRow;
    getForm(): Form | null;
    getPage(): Page | null;
    getApp(): Application;
    getRow(key: Key): RawRow | null;
    getRows(): RawRow[];
    getRowByIndex(i: number): RawRow;
    discard(): void;
    static keyToParams(key: Key, paramName?: string): KeyRecord;
    getChangesByKey(): ChangesByKey;
    getRowWithChanges(row: RawRow): RawRow;
    hasNewRows(): boolean;
    static copyNewValues(row: RawRow, newValues: RawRow): void;
    updateRow(key: Key, newValues: RawRow): void;
    getTable(): import("..").Table;
    getDatabase(): import("..").Database;
    getType(columnName: string): any;
    insert(row?: RawRow): Promise<any>;
    delete(key: Key): Promise<Result | null>;
    update(): Promise<Result | null>;
    onTableInsert: (e: any) => Promise<void>;
    onTableUpdate: (e: any) => Promise<void>;
    onTableDelete: (e: any) => Promise<void>;
    onTableRefresh: (e: any) => Promise<any>;
    isSurrogate(): boolean;
    moveRow(row: RawRow, offset: number): void;
    getLimit(): number | null;
    getCount(): number;
    getFrame(): number;
    getLastFrame(): number;
    setFrame(frame: number): void;
    getFramesCount(): number;
    hasMore(): boolean;
    isPersistent(): boolean;
    refresh(): Promise<void>;
}
