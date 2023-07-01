import { Model } from '../Model';
import { Table } from '../Table/Table';
import { Helper } from '../../../common/Helper';
import { DatabaseResult } from '../../../../Result';

export class Database extends Model {
    tables: Table[] = [];

    init() {
        // console.log('Database.init', this.getName());
        for (const data of this.getData().tables) {
            const table = new Table(data, this);
            table.init();
            this.addTable(table);
        }
    }

    addTable(table: Table) {
        this.tables.push(table);
    }

    findTable(name: string): Table | undefined {
        return this.tables.find((table) => table.getName() === name);
    }

    getTable(name: string): Table {
        const table = this.findTable(name);
        if (!table) throw new Error(`${this.getFullName()}: no table with name: ${name}`);
        return table;
    }

    emitResult(result: DatabaseResult, source = null) {
        console.log('Database.emitResult');
        const promises: any[] = [];
        for (const table in result) {
            promises.push(...this.getTable(table).emitResult(result[table], source));
        }
        return promises;
    }
}

Helper.registerGlobalClass(Database);
