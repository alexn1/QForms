'use strict';

class TreeFormController extends FormController {

    constructor(model, parent) {
        super(model, parent);
        this.tree = null;
    }

    init() {
        const self = this;
        super.init();
        $(this.view).find('button.newRoot').click(function() {self.onNewRootClick(this);});
        $(this.view).find('button.new').click(function()     {self.onNewClick(this);    });
        $(this.view).find('button.delete').click(function()  {self.onDeleteClick(this); });
        const treeSelector = '#{pageId}_{formName}_TreeWidget'.replace('{pageId}', this.model.getPage().id).replace('{formName}', this.model.getName());
        const tree = this.view.querySelector(treeSelector);
        this.tree = new DataTreeWidget(tree, this);
        this.tree.init();
        this.tree.on('select', this.listeners.select = this.onTreeItemSelect.bind(this));
        this.tree.on('doubleClick', this.listeners.doubleClick = this.onTreeItemDoubleClick.bind(this));
    }

    deinit() {
        this.tree.off('select', this.listeners.select);
        this.tree.off('doubleClick', this.listeners.doubleClick);
        this.tree.deinit();

        for (const name in this.fields) {
            this.fields[name].deinit();
        }
        for (const name in this.controls) {
            this.controls[name].deinit();
        }

        super.deinit();
    }

    /*fill() {
        super.fill();
        this.tree.fill();
    }*/

    onTreeItemSelect(e) {
        //console.log(this.tree.active);
    }

    onTreeItemDoubleClick(e) {
        this.edit(e.item.qRow);
    }

    async onNewRootClick(ctrl) {
        await this.newRoot();
    }

    onNewClick(ctrl) {
        this.new(this.tree.active.qRow);
    }

    onDeleteClick(ctrl) {
        this.model.delete(this.tree.active.qRow);
    }

    async new(row) {
        const key = this.model.getDataSource().getRowKey(row);
        await this.openPage({
            name   : this.model.data.itemEditPage,
            newMode: true,
            params : QForms.keyToParams(key, 'parentKey')
        });
    }

    async edit(row) {
        const key = this.model.getDataSource().getRowKey(row);
        await this.openPage({
            name: this.model.data.itemEditPage,
            key : key
        });
    }

    async newRoot() {
        await this.openPage({
            name   : this.data.itemEditPage,
            newMode: true,
            params : {'parentKey':''}
        });
    }

}