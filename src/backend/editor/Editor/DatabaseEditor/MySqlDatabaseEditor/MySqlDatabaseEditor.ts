import { DatabaseEditor, DatabaseParams } from '../DatabaseEditor';
import { Editor } from '../../Editor';
import { DatabaseScheme } from '../../../../common/Scheme/DatabaseScheme';

export class MySqlDatabaseEditor extends DatabaseEditor {
    static createData(params: DatabaseParams): DatabaseScheme {
        if (!params.name) throw new Error('no name');
        return {
            '@class': 'MySqlDatabase',
            '@attributes': {
                ...DatabaseEditor.createAttributes(params),
            },
            params: [...(params.params ? params.params.map(Editor.createItemData) : [])],
            tables: [...(params.tables ? params.tables.map(Editor.createItemData) : [])],
        };
    }
}
