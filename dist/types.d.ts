export type Scalar = string | number | boolean;
export type JSONString = string & {
    type: 'JSONString';
};
export type Key = JSONString & {
    type2: 'Key';
};
export type KeyItem = Scalar;
export type KeyTuple = KeyItem[];
export type KeyRecord = {
    [column: string]: KeyItem;
};
export type Row = {
    [column: string]: any;
} & {
    type: 'Row';
};
export type RawRow = {
    [column: string]: JSONString;
} & {
    type: 'RawRow';
};
export type ChangesByKey = {
    [key: Key]: RawRow;
};
export type Align = 'left' | 'center' | 'right';
export type Visibility = 'visible' | 'hidden';
export declare const keyTupleToKey: (keyArray: KeyTuple) => Key;
export declare const keyToKeyTuple: (key: Key) => KeyTuple;
