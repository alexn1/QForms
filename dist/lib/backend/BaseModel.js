"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
class BaseModel {
    constructor(data, parent) {
        if (!data)
            throw new Error(`new ${this.constructor.name}: no data`);
        this.data = data;
        this.parent = parent;
    }
    static getClassName(data) {
        return data['@class'];
    }
    static getAttr(data, name) {
        return data['@attributes'][name];
    }
    static getName(data) {
        return BaseModel.getAttr(data, 'name');
    }
    static getEnvList(data) {
        const list = data.env ? Object.keys(data.env).filter(env => env !== 'local') : [];
        return ['local', ...list];
    }
    getClassName() {
        return this.data['@class'];
    }
    getName() {
        return BaseModel.getName(this.data);
    }
    static attributes(data) {
        return data['@attributes'];
    }
    attributes() {
        return this.data['@attributes'];
    }
    getAttr(name) {
        if (!this.isAttr(name))
            throw new Error(`no attribute '${name}'`);
        return this.data['@attributes'][name];
    }
    setAttr(name, value) {
        this.data['@attributes'][name] = value;
    }
    isAttr(name) {
        return this.data['@attributes'][name] !== undefined;
    }
    isData(colName, name) {
        if (!colName)
            throw new Error('isData: no colName');
        if (!name)
            throw new Error('isData: no name');
        return !!this.getColItemData(colName, name);
    }
    getData() {
        return this.data;
    }
    getCol(name) {
        if (!name)
            throw new Error('getCol: no name');
        const arr = this.data[name];
        if (!arr) {
            // console.log('this.data', this.data);
            throw new Error(`getCol: no col ${name}`);
        }
        return arr;
    }
    getItemNames(colName) {
        return this.getCol(colName).map(data => BaseModel.getName(data));
    }
    getColItemData(colName, name) {
        const data = BaseModel.findColDataByName(this.getCol(colName), name);
        if (data)
            return data;
        return null;
    }
    removeColData(colName, name) {
        const col = this.getCol(colName);
        const data = BaseModel.findColDataByName(col, name);
        if (!data)
            throw new Error(`removeColData: no ${name} in ${colName}`);
        col.splice(col.indexOf(data), 1);
        return data;
    }
    static findColDataByName(col, name) {
        return col.find(data => BaseModel.getName(data) === name);
    }
    addModelData(colName, data) {
        const name = BaseModel.getName(data);
        if (this.getColItemData(colName, name))
            throw new Error(`${name} already exists in ${colName}`);
        this.getCol(colName).push(data);
    }
    getApp() {
        throw new Error('getApp: not implemented');
    }
    replaceDataColItem(colName, oldData, newData) {
        const dataCol = this.getCol(colName);
        const i = dataCol.indexOf(oldData);
        if (i === -1)
            throw new Error(`replaceDataColItem: no ${BaseModel.getName(oldData)} in ${colName}`);
        dataCol[i] = newData;
        return i;
    }
    getParent() {
        return this.parent;
    }
}
exports.BaseModel = BaseModel;
