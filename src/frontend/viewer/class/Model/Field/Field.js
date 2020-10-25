'use strict';

class Field extends Model {
    // constructor(data, parent) {
    //     super(data, parent);
    // }

    init() {
    }

    replaceThis(value) {
        return value.replace(/\{([@\w\.]+)\}/g, (text, name) => {
            if (name.indexOf('.') === -1) return text;
            let arr = name.split('.');
            if (arr[0] === 'this') arr[0] = this.getPage().getName();
            if (arr[0] === 'parent' && this.getPage().parentPageName) {
                arr[0] = this.getPage().parentPageName;
            }
            return `{${arr.join('.')}}`;
        });
    }

    fillDefaultValue(row) {
        // console.log('Field.fillDefaultValue', this.getFullName());
        if (!this.data.column) return;
        const defaultValue = this.replaceThis(this.data.defaultValue);
        const params = {
            ...this.getApp().data.params,
            ...this.getPage().params,
        };
        const code = QForms.templateValue(defaultValue, params);
        let value;
        try {
            //console.log('eval: ' + code);
            value = eval(code);
            if (value !== undefined) {
                row[this.data.column] = JSON.stringify(value);
            }
        } catch (err) {
            throw new Error(`[${this.getFullName()}] default value error: ${err.toString()}`);
        }
    }

    valueToPageParams(row) {
        // console.log('Field.valueToPageParams', this.getFullName());
        this.getPage().params[this.getFullName()] = this.getValue(row);
    }

    setValue(row, value) {
        console.log('Field.setValue', this.getFullName(), value);
        if (!this.data.column) throw new Error(`field has no column: ${this.getFullName()}`);
        const valueForDataSource = this.getValueForDataSource(value);
        this.getForm().getDataSource().setValue(row, this.data.column, valueForDataSource);
        this.valueToPageParams(row);
    }

    getValueForDataSource(value) {
        /*
        if (value === undefined || value === null) return value;
        const fieldType = this.getType();
        const valueType = typeof value;
        if (fieldType === 'date') {
            if (!(value instanceof Date)) {
                throw new Error(`${this.getFullName()}: value not instance of Date`);
            }
        } else if (fieldType !== valueType) {
            throw new Error(`${this.getFullName()}: wrong value type for column: ${valueType} instead of ${fieldType}`);
        }
        if (valueType === 'object') {
            if (value instanceof Date) return value.toISOString();
            return JSON.stringify(value);
        }*/
        return JSON.stringify(value);
    }

    isChanged(row) {
        // console.log('Field.isChanged', this.getFullName());
        if (!this.data.column) throw new Error(`${this.getFullName()}: field has no column`);
        return this.getDataSource().isRowColumnChanged(row, this.data.column);
    }

    getValueFromDataSource(row) {
        if (!this.hasColumn()) throw new Error(`${this.getFullName()}: no column`);
        return this.getForm().getDataSource().getValue(row, this.data.column);
    }

    hasColumn() {
        return !!this.data.column;
    }

    getValue(row) {
        // console.log('Field.getValue', this.getFullName());
        if (this.data.column) {
            let value = this.getValueFromDataSource(row);
            /*
            if (value === null) return null;
            if (value === undefined) return undefined;
            const fieldType = this.getType();
            if (fieldType === 'date') {
                if (typeof value !== 'string') throw new Error(`${this.getFullName()}: wrong value for date column: ${value}`);
                return new Date(value);
            }
            if (fieldType === 'object') return JSON.parse(value);
            return value;*/
            if (value === undefined) return undefined;
            if (value === null) throw new Error(`[${this.getFullName()}]: null is wrong value for data source`);
            try {
                return JSON.parse(value, Helper.dateTimeReviver);
            } catch (err) {
                console.log('value:', this.getFullName(), value);
                throw err;
            }
        }
        if (this.data.value) return eval(this.data.value);
        throw new Error(`${this.getFullName()}: no column and no value in field`);
    }

    getDataSource() {
        return this.getForm().getDataSource();
    }

    getType() {
        const dataSource = this.getDataSource();
        if (dataSource.getClassName() === 'SqlDataSource' && this.data.column) {
            return this.getDataSource().getType(this.data.column);
        }
        if (this.data.type) return this.data.type;
        throw new Error(`${this.getFullName()}: field type empty`);
    }

    getForm() {
        return this.parent;
    }

    getPage() {
        return this.parent.parent;
    }

    getApp() {
        return this.parent.parent.parent;
    }

    isReadOnly() {
        return this.data.readOnly === 'true';
    }
    isNotNull() {
        return this.data.notNull === 'true';
    }
    isNullable() {
        return this.data.notNull === 'false';
    }
    isVisible() {
        return this.data.isVisible === 'true';
    }
    getWidth() {
        return this.data.width !== '0' ? parseInt(this.data.width) : 100;
    }
    getFullName() {
        return `${this.getPage().getName()}.${this.getForm().getName()}.${this.getName()}`;
    }
}
