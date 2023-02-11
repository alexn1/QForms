"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentDataSource = void 0;
const DataSource_1 = require("../DataSource");
class PersistentDataSource extends DataSource_1.DataSource {
    decodeChanges(changes) {
        const dChanges = {};
        for (const key in changes) {
            dChanges[key] = this.getValuesFromRow(changes[key]);
        }
        return dChanges;
    }
    getValuesFromRow(row) {
        console.log('PersistentDataSource.getValuesFromRow', row);
        const values = {};
        for (const field of this.getForm().fields) {
            const column = field.getAttr('column');
            if (row.hasOwnProperty(column)) {
                const value = field.rawToValue(row[column]);
                values[column] = field.valueToSqlValue(value);
            }
        }
        return values;
    }
    /* getDatabase(): TDatabase {
        return super.getDatabase() as MongoDbDatabase;
    } */
    /* getDatabase(): SqlDatabase {
        return super.getDatabase() as SqlDatabase;
    } */
    getDatabase() {
        const databaseName = this.getAttr('database');
        if (!databaseName)
            throw new Error(`${this.getFullName()}: no database name`);
        return this.getApp().getDatabase(databaseName);
    }
}
exports.PersistentDataSource = PersistentDataSource;
