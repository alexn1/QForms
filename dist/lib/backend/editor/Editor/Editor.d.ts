import { BaseModel } from '../../BaseModel';
export declare class Editor extends BaseModel {
    createFileByParams(newFilePath: any, templateFilePath: any, params: any): Promise<any>;
    getFile(filePath: any): Promise<string>;
    saveFile(filePath: any, content: any): Promise<void>;
    getCustomFile(ext: any): Promise<string>;
    saveCustomFile(ext: any, text: any): Promise<void>;
    getCustomFilePath(ext: any): Promise<any>;
    moveDataColItem(colName: any, name: any, offset: any): void;
    setData(colName: any, newData: any): any;
    createItemEditor(colName: string, itemName: string): any;
    getCustomDirPath(): Promise<any>;
    getCollectionDirPath(): Promise<string>;
    moveItemUp(colName: any, itemName: any): void;
    moveItemDown(colName: any, itemName: any): void;
    newItemData(className: any, colName: any, params: any): any;
    getColName(): void;
    static createItemData(data: any): any;
}
