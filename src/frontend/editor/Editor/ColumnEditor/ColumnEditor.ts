import {Editor} from '../Editor';
import {FrontHostApp} from '../../../common';

export class ColumnEditor extends Editor {
    table: any;
    constructor(data, table) {
        super(data, table);
        this.table = table;
    }

    async setValue(name, value) {
        //console.log('ColumnEditor.setValue', name + ' = ' + value);
        const data = await FrontHostApp.doHttpRequest({
            controller: 'Column',
            action    : 'save',
            params    : {
                database: this.table.database.getName(),
                table   : this.table.getName(),
                column  : this.getName(),
                attr    : name,
                value   : value
            }
        });
        this.setAttr(name, value);
        return data;
    }

    async deleteData() {
        await FrontHostApp.doHttpRequest({
            controller: 'Column',
            action    : 'delete',
            params    : {
                database: this.table.database.getName(),
                table   : this.table.getName(),
                column  : this.getName(),
            }
        });
    }
    async delete() {
        await this.deleteData();
        this.parent.removeColumn(this);
    }

}
