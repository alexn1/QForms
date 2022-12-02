import {DocumentController} from '../DocumentController';
import {KeyColumnController} from '../../KeyColumnController/KeyColumnController';
import {EditorFrontHostApp} from '../../../EditorFrontHostApp/EditorFrontHostApp';
import {NewKeyColumnController} from '../../../ModalController/NewKeyColumnController/NewKeyColumnController';
import {SqlDataSourceView} from './SqlDataSourceView';

export class DataSourceController extends DocumentController {
    keyColumns: any[];
    items: any[];
    constructor(model, parent) {
        super(model, parent);
        this.keyColumns = [];
        this.items = [
            {
                getTitle: () => 'Key Columns',
                items: this.keyColumns
            }
        ];
    }
    getTitle() {
        return `${this.model.getClassName()}: ${this.model.getName()}`;
    }
    getStyle() {
        return {
            // fontWeight: 'bold',
            color: 'brown'
        };
    }
    init() {
        this.model.keyColumns.forEach(keyColumn => this.createKeyColumn(keyColumn));
    }
    createKeyColumn(model) {
        const keyColumn = new KeyColumnController(model, this);
        keyColumn.init();
        this.keyColumns.push(keyColumn);
        return keyColumn;
    }
    removeKeyColumn(keyColumnController) {
        console.log('DataSourceController.removeKeyColumn', keyColumnController.getTitle());
        const i = this.keyColumns.indexOf(keyColumnController);
        if (i === -1) throw new Error('no such keyColumnController');
        this.keyColumns.splice(i, 1);
    }
    getActions() {
        return [
            {'action' : 'newItem', 'caption': 'New Key Column'},
            {'action':  'moveUp', 'caption':   'Move Up'},
            {'action':'moveDown', 'caption': 'Move Down'},
            {'action' : 'delete', 'caption': 'Delete'}
        ];
    }

    async doAction(name) {
        switch (name) {
            case 'newItem':
                await this.actionNewKeyColumn();
                break;
            case 'delete':
                await this.delete();
                break;
            case 'moveUp':
                await this.model.moveUp();
                this.parent.moveColItem('dataSources', this, -1);
                EditorFrontHostApp.editorApp.treeWidget2.rerender();
                break;
            case 'moveDown':
                await this.model.moveDown();
                this.parent.moveColItem('dataSources', this, 1);
                EditorFrontHostApp.editorApp.treeWidget2.rerender();
                break;
        }
    }

    async actionNewKeyColumn() {
        await EditorFrontHostApp.editorApp.openModal(new NewKeyColumnController({onCreate: async values => {
            const keyColumn = await this.model.newKeyColumn(values.name);
            const keyColumnController = this.createKeyColumn(keyColumn);
            await EditorFrontHostApp.editorApp.treeWidget2.select(keyColumnController);
            keyColumnController.view.parent.open();
            this.view.rerender();
            EditorFrontHostApp.editorApp.treeWidget2.scrollToSelected();
        }}));
    }

    getPropList() {
        const propList = {
            list   : {},
            options: {}
        };

        // list
        for (const name in this.model.data['@attributes']) {
            if (!['countQuery', 'singleQuery', 'multipleQuery'].includes(name)) {
                propList.list[name] = this.model.data['@attributes'][name];
            }
        }

        return propList;
    }
    getDocumentViewClass() {
        if (this.model.getClassName() === 'SqlDataSource') return SqlDataSourceView;
        return super.getDocumentViewClass();
    }
    async onSaveClick(name, value) {
        // console.log('DataSourceController.onSaveClick', name, value);
        await this.model.setValue(name, value);
    }
    async delete() {
        await this.model.delete();
        this.parent.removeDataSource(this);
        EditorFrontHostApp.editorApp.treeWidget2.select(null);
        EditorFrontHostApp.editorApp.treeWidget2.rerender();
    }
    onCreateModelBack = async e => {
        const data = await this.model.createModelBackJs();
    }
}
