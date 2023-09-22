import { JSONString, Scalar, Query, QueryRecord } from '../../types';
import { ReactComponent } from './ReactComponent';
export declare class Helper {
    static formatDate(date: Date, format: string): string;
    static formatNumber(value: number): string;
    static today(): Date;
    static getStartOfDay(date: Date): Date;
    static encodeObject(obj: Record<string, any>): Record<string, JSONString>;
    static encodeValue<T>(value: T): JSONString<T>;
    static decodeObject(eObj: Record<string, JSONString>): Record<string, any>;
    static decodeValue(raw: JSONString): any;
    static dateTimeReviver(key: string, value: any): any;
    static createReactComponent(rootElement: Element, type: any, props?: {}, children?: any): ReactComponent | undefined;
    static createReactComponent2(rootElement: Element, type: any, props?: {}, children?: any): ReactComponent | undefined;
    static destroyReactComponent(root: any): void;
    static readFileAsDataURL(file: Blob): Promise<string | ArrayBuffer | null>;
    static templateToJsString(value: string, params: Record<string, any>): string;
    static moveArrItem(arr: any[], item: any, offset: number): void;
    static formatTime(_sec: number): string;
    static formatTime2(_sec: number): string;
    static SECOND(): number;
    static MINUTE(): number;
    static HOUR(): number;
    static DAY(): number;
    static WEEK(): number;
    static fallbackCopyTextToClipboard(text: string): void;
    static copyTextToClipboard(text: string): Promise<void>;
    static addMinutes(date: Date, minutes: number): void;
    static removeTimezoneOffset(date: Date): void;
    static addTimezoneOffset(date: Date): void;
    static cloneDate(date: Date): Date;
    static fillArray(n: number): number[];
    static setCookie(name: string, value: Scalar, time: number): void;
    static getCookie(name: string): string | undefined;
    static eraseCookie(name: string): void;
    static delay(ms?: number): Promise<unknown>;
    static registerGlobalClass(Class: any): void;
    static getGlobalClass(className: string): any;
    static addClassToDocumentElement(className: string): void;
    static headersToRecord(headers: Headers): Record<string, string>;
    static queryToString(query: Query): string;
    static queryRecordToString(name: string, record: QueryRecord): string;
}
