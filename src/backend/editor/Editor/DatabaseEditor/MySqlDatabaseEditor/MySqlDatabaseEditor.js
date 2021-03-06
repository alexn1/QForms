const DatabaseEditor = require('../DatabaseEditor');

class MySqlDatabaseEditor extends DatabaseEditor {
    static createData(params) {
        if (!params.name) throw new Error('no name');
        return {
            '@class'     : 'MySqlDatabase',
            '@attributes': {
                name : params.name
            },
            params: {},
            tables: {},
            params2: [],
            tables2: [],
        };
    }
}
module.exports = MySqlDatabaseEditor;
