"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdFieldController = void 0;
const EdVisualController_1 = require("../EdVisualController");
const EditorFrontHostApp_1 = require("../../../../EditorFrontHostApp/EditorFrontHostApp");
const ChangeClassController_1 = require("../../../../EdModalController/ChangeClassController/ChangeClassController");
const EdVisualView_1 = require("../EdVisualView");
class EdFieldController extends EdVisualController_1.EdVisualController {
    /*constructor(model, parent) {
        super(model, parent);
    }*/
    getTitle() {
        return `${this.model.getClassName()}: ${this.model.getName()}`;
    }
    getStyle() {
        return {
            // fontWeight: 'bold',
            color: 'blue',
        };
    }
    getActions() {
        return [
            { action: 'changeClass', caption: 'Change Class' },
            { action: 'moveUp', caption: 'Move Up' },
            { action: 'moveDown', caption: 'Move Down' },
            { action: 'delete', caption: 'Delete' },
        ];
    }
    async doAction(name) {
        switch (name) {
            case 'changeClass':
                await this.actionChangeClass();
                break;
            case 'delete':
                await this.delete();
                break;
            case 'moveUp':
                await this.model.moveUp();
                this.parent.moveColItem('fields', this, -1);
                EditorFrontHostApp_1.EditorFrontHostApp.editorApp.treeWidget2.rerender();
                break;
            case 'moveDown':
                await this.model.moveDown();
                this.parent.moveColItem('fields', this, 1);
                EditorFrontHostApp_1.EditorFrontHostApp.editorApp.treeWidget2.rerender();
                break;
        }
    }
    async actionChangeClass() {
        await EditorFrontHostApp_1.EditorFrontHostApp.editorApp.openModal(new ChangeClassController_1.ChangeClassController({
            fieldCtrl: this,
            onCreate: async (values) => {
                const data = await this.model.changeClass({ class: values.class });
                console.debug(data);
                EditorFrontHostApp_1.EditorFrontHostApp.editorApp.fillPropertyGrid(this);
                this.view.rerender();
            },
        }));
    }
    getPropList() {
        const list = this.model.data['@attributes'];
        const options = {};
        options['visible'] = ['true', 'false'];
        options['readOnly'] = ['true', 'false'];
        options['notNull'] = ['true', 'false'];
        options['param'] = ['true', 'false'];
        options['validateOnChange'] = ['true', 'false'];
        options['validateOnBlur'] = ['true', 'false'];
        options['autoFocus'] = ['true', 'false'];
        options['timezone'] = ['true', 'false'];
        options['newRowMode'] = ['disabled', 'editPage', 'createPage'];
        options['type'] = ['', 'string', 'number', 'boolean', 'object', 'date'];
        return { list: list, options: options };
    }
    async delete() {
        await this.model.delete();
        this.parent.removeField(this);
        EditorFrontHostApp_1.EditorFrontHostApp.editorApp.treeWidget2.select(null);
        EditorFrontHostApp_1.EditorFrontHostApp.editorApp.treeWidget2.rerender();
    }
    getDocumentViewClass() {
        return EdVisualView_1.EdVisualView;
    }
}
exports.EdFieldController = EdFieldController;
