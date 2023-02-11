export type Key = string;
export type Row = Object;
export type Insert = Key[];
export type Delete = Key[];
export declare class InsertEx {
    [key: Key]: Row;
}
export declare class Update {
    [oldKey: Key]: Key;
}
export declare class UpdateEx {
    [oldKey: Key]: Row;
}
export declare class TableResult {
    insert?: Insert;
    insertEx?: InsertEx;
    update?: Update;
    updateEx?: UpdateEx;
    delete?: Delete;
}
export declare class DatabaseResult {
    [name: string]: TableResult;
}
export declare class Result {
    [name: string]: DatabaseResult;
    static addInsertToResult(result: Result, dName: string, tName: string, key: Key): void;
    static addInsertExToResult(result: Result, dName: string, tName: string, key: Key, row: Row): void;
    static addUpdateToResult(result: Result, dName: string, tName: string, oldKey: Key, newKey: Key): void;
    static addUpdateExToResult(result: Result, dName: string, tName: string, oldKey: Key, row: Row): void;
    static addDeleteToResult(result: Result, dName: string, tName: string, key: Key): void;
    static addTableToResult(result: Result, dName: string, tName: string, tResult: TableResult): void;
}
