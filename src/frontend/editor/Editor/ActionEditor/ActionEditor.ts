import {Editor} from '../Editor';
import {FormEditor} from '../FormEditor/FormEditor';
import {PageEditor} from '../PageEditor/PageEditor';
import {FrontHostApp} from '../../../common';

export class ActionEditor extends Editor {
    /*constructor(data, parent) {
        super(data, parent);
    }*/

    /*async getView(view) {
        return await FrontHostApp.doHttpRequest({
            controller: 'Action',
            action    : 'getView',
            params    : {
                view : view,
                page : this.data !== undefined ? this.form.page.getName() : null,
                form : this.data !== undefined ? this.form.getName()      : null,
            }
        });
    }*/

    getParams() {
        if (this.parent instanceof FormEditor) {
            return {
                pageFileName: this.parent.page.pageLink.getAttr('fileName'),
                form        : this.parent.getAttr('name'),
                action      : this.getAttr('name'),
            };
        } else if (this.parent instanceof PageEditor) {
            return {
                pageFileName: this.parent.pageLink.getAttr('fileName'),
                action      : this.getAttr('name'),
            };
        }
        return {
            action: this.getAttr('name'),
        };
    }

    async setValue(name, value) {
        //console.log('ActionEditor.setValue', name + ' = ' + value);
        const data = await FrontHostApp.doHttpRequest({
            controller: 'Action',
            action    : 'save',
            params    : {
                ...this.getParams(),
                attr        : name,
                value       : value
            }
        });
        this.setAttr(name, value);
        return data;
    }

    async deleteData() {
        await FrontHostApp.doHttpRequest({
            controller: 'Action',
            action    : 'delete',
            params    : {
                ...this.getParams(),
            }
        });
    }
    async delete() {
        console.log('ActionEditor.delete', this.getName());
        await this.deleteData();
        this.parent.removeAction(this);
    }
    moveUp() {
        return FrontHostApp.doHttpRequest({
            controller : 'Action',
            action     : 'moveUp',
            params     : {
                ...this.getParams(),
            }
        });
    }
    moveDown() {
        return FrontHostApp.doHttpRequest({
            controller : 'Action',
            action     : 'moveDown',
            params     : {
                ...this.getParams(),
            }
        });
    }
}
