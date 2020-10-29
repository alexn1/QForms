const qforms = require('./qforms');

class Test {
    static async getUpdateQuery() {
        console.log('Test.getUpdateQuery');
        const query = qforms.PostgreSqlDatabase.getUpdateQuery('tableName', {field1: 'value1'}, {id: 1});
        console.log('query:', query);
        return {query};
    }

    static async mapObject() {
        console.log('Test.mapObject');
        const values = {
            field1: 'value1',
            field2: 'value2',
        };
        const values2 = qforms.Helper.mapObject(values, (name, value) => [`val_${name}`, value]);
        return {
            values,
            values2
        };
    }

    static async blob(req, res, context, application) {
        console.log('Test.blob');
        const db = application.getDatabase('default');
        // const rows = await db.queryRows(context, 'select id, message from log order by id desc limit 1');
        return {abc: 'xyz'};
    }

}

module.exports = Test;
