import { Editor } from '../Editor';
import { FrontHostApp } from '../../../common';

export class FieldEditor extends Editor {
    constructor(data, form) {
        super(data, form);
        this.form = form;
    }

    async setValue(name, value) {
        //console.log(name + ' = ' + value);
        const data = await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'save',
            params: {
                pageFileName: this.form.page.pageLink.getFileName(),
                form: this.form.getName(),
                field: this.getName(),
                attr: name,
                value: value,
            },
        });
        this.setAttr(name, value);
        return data;
    }
    async deleteData() {
        await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'delete',
            params: {
                pageFileName: this.form.page.pageLink.getFileName(),
                form: this.form.getName(),
                field: this.getName(),
            },
        });
    }
    async delete() {
        await this.deleteData();
        this.parent.removeField(this);
    }
    async getView(view) {
        return await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'getView',
            params: {
                view: view,
                page: this.data !== undefined ? this.form.page.getName() : null,
                form: this.data !== undefined ? this.form.getName() : null,
                field: this.data !== undefined ? this.getName() : null,
            },
        });
    }

    async saveView(text, view) {
        return await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'saveView',
            params: {
                page: this.form.page.getName(),
                form: this.form.getName(),
                field: this.getName(),
                view: view,
                text: text,
            },
        });
    }

    async saveController(text) {
        return await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'saveController',
            params: {
                page: this.form.page.getName(),
                form: this.form.getName(),
                field: this.getName(),
                text: text,
            },
        });
    }

    async createView() {
        return await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'createView',
            params: {
                page: this.form.page.getName(),
                form: this.form.getName(),
                field: this.getName(),
                class: this.getClassName(),
            },
        });
    }

    async createStyle() {
        return await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'createStyle',
            params: {
                page: this.form.page.getName(),
                form: this.form.getName(),
                field: this.getName(),
                class: this.getClassName(),
            },
        });
    }

    async createController() {
        return await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'createController',
            params: {
                page: this.form.page.getName(),
                form: this.form.getName(),
                field: this.getName(),
                class: this.getClassName(),
            },
        });
    }

    async changeClass(params) {
        params['page'] = this.form.page.getName();
        params['form'] = this.form.getName();
        params['field'] = this.getName();
        const data = await FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'changeClass',
            params: params,
        });
        return (this.data = data);
    }

    moveUp() {
        return FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'moveUp',
            params: {
                pageFileName: this.form.page.pageLink.getFileName(),
                form: this.form.getName(),
                field: this.getName(),
            },
        });
    }

    moveDown() {
        return FrontHostApp.doHttpRequest({
            controller: 'Field',
            action: 'moveDown',
            params: {
                pageFileName: this.form.page.pageLink.getFileName(),
                form: this.form.getName(),
                field: this.getName(),
            },
        });
    }
}
