import SqlDataSource from "../DataSource/SqlDataSource/SqlDataSource";

const path = require('path');

import Model from '../Model';
import Application from '../Application/Application';
import Page from '../Page/Page';
import Form from '../Form/Form';
import Column from "../Column/Column";

const Helper = require('../../../Helper');

class Field extends Model {
    static async create(data, parent): Promise<Field> {
        return new Field(data, parent);
    }

    // constructor(data, parent) {
    //     super(data, parent);
    // }

    fillAttributes(response: any): void {
        response.class        = this.getClassName();
        response.name         = this.getAttr('name');
        response.caption      = this.getAttr('caption');
        response.column       = this.getAttr('column');
        response.defaultValue = this.getAttr('defaultValue');
        response.value        = this.getAttr('value');
        response.param        = this.getAttr('param');
        response.visible      = this.getAttr('visible');
        response.type         = this.getAttr('type');
        response.width        = this.getAttr('width');
        response.cssBlock     = this.getAttr('cssBlock');
        response.viewClass    = this.getAttr('viewClass');
        response.autoFocus    = this.getAttr('autoFocus');
    }

    getDirPath(): string {
        return path.join(this.parent.getDirPath(), 'fields', this.getName());
    }

    fillDefaultValue(context, row) {
        const column = this.getAttr('column');
        if (!column) return;
        const defaultValue = this.getForm().replaceThis(context, this.getAttr('defaultValue'));
        const params = context.getParams();
        const js = Helper.templateToJsString(defaultValue, params);
        let value;
        try {
            value = eval(js);
            if (value !== undefined) {
                row[column] = this.valueToRaw(value);
            }
        } catch (e) {
            throw new Error(`[${this.getFullName()}] fillDefaultValue: ${e.toString()}`);
        }
    }

    dumpRowValueToParams(row, params) {
        // console.log('Field.dumpRowValueToParams', this.getFullName());
        const fullName = this.getFullName();
        try {
            const column = this.getAttr('column');
            if (!column) throw new Error('no column attr');
            const value = row[column];
            // console.log('value:', value);
            params[fullName] = value !== undefined ? Helper.decodeValue(value) : null;
        } catch (err) {
            // console.log('row:', row);
            err.message = `${fullName}: ${err.message}`;
            throw err;
        }
    }

    getFullName(): string {
        return [
            this.getForm().getPage().getName(),
            this.getForm().getName(),
            this.getName()
        ].join('.');
    }

    getApp(): Application {
        return this.parent.parent.parent;
    }

    getPage(): Page {
        return this.parent.parent;
    }

    getForm(): Form {
        return this.parent;
    }
    isParam(): boolean {
        return this.isAttr('param') && this.getAttr('param') === 'true';
    }
    valueToRaw(value): any {
        return Helper.encodeValue(value);
    }
    rawToValue(raw): any {
        return Helper.decodeValue(raw);
    }
    isTimezone() {
        return this.getAttr('timezone') === 'true';
    }
    getDatabaseTableColumn(): Column {
        if (!this.getAttr('column')) throw new Error(`${this.getFullName()}: column attr is empty`);
        const defaultDataSource = this.getForm().getDataSource('default') as SqlDataSource;
        if (!defaultDataSource) throw new Error(`${this.getFullName()}: no default datasource`);
        return defaultDataSource.getTable().getColumn(this.getAttr('column'));
    }
    getType(): string {
        if (this.getAttr('column')) {
            return this.getDatabaseTableColumn().getAttr('type');
        }
        if (this.getAttr('type')) {
            return this.getAttr('type');
        }
        throw new Error(`${this.getFullName()}: type attr is empty`);
    }
    getDbType() {
        return this.getDatabaseTableColumn().getAttr('dbType');
    }
    valueToSqlParam(value) {
        if (this.getDbType() === 'json') {
            return JSON.stringify(value);
        }
        return value;
    }
}

export = Field;
