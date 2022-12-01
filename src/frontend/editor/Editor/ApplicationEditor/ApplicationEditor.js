import {Editor} from '../Editor';
import {DatabaseEditor} from '../DatabaseEditor/DatabaseEditor';

export class ApplicationEditor extends Editor {

    constructor(data) {
        super(data);
        this.databases   = [];
        this.dataSources = [];
        this.actions     = [];
        this.pageLinks   = [];
    }

    init() {
        console.log('ApplicationEditor.init', this.data);
        // databases
        for (const data of this.data.databases) {
            this.createDatabase(data);
        }

        // dataSources
        for (const data of this.data.dataSources) {
            this.createDataSource(data);
        }

        // actions
        for (const data of this.data.actions) {
            this.createAction(data);
        }

        // pageLinks
        for (const data of this.data.pageLinks) {
            this.createPageLink(data);
        }
    }
    createDatabase(data) {
        const database = new DatabaseEditor(data, this);
        database.init();
        this.databases.push(database);
        return database;
    }
    createPageLink(data) {
        const pageLink = new PageLinkEditor(data, this);
        pageLink.init();
        this.pageLinks.push(pageLink);
        return pageLink;
    }
    removeDatabase(database) {
        console.log('ApplicationEditor.removeDatabase', database.getName());
        const i = this.databases.indexOf(database);
        if (i === -1) throw new Error('no such database');
        this.databases.splice(i, 1);
    }

    removePageLink(pageLink) {
        console.log('ApplicationEditor.removePageLink', pageLink.getName());
        const i = this.pageLinks.indexOf(pageLink);
        if (i === -1) throw new Error('no such pageLink');
        this.pageLinks.splice(i, 1);
    }
    async setValue(name, value) {
        //console.log(name + ' = ' + value);
        const data = await FrontHostApp.doHttpRequest({
            controller: 'Application',
            action    : 'save',
            params    : {
                attr : name,
                value: value
            }
        });
        this.setAttr(name, value);
        return data;
    }

    async newPageAndPageLinkData(params) {
        params['menu'] = (params['startup'] === 'true') ? 'Pages' : '';
        return await FrontHostApp.doHttpRequest({
            controller: 'Page',
            action    : '_new',
            params    : params
        });
    }

    async newPage(params) {
        const {page: pageData, pageLink: pageLinkData} = await this.newPageAndPageLinkData(params);
        const pageLink = this.createPageLink(pageLinkData);
        return new PageEditor(pageData, pageLink);
    }

    async newDatabase(params) {
        const data = await FrontHostApp.doHttpRequest({
            controller: 'Database',
            action    : '_new',
            params    : params
        });
        return this.createDatabase(data);
    }

    async getView(view) {
        return await FrontHostApp.doHttpRequest({
            controller: 'Application',
            action    : 'getView',
            params    : {
                app : this.getName(),
                view: view
            }
        });
    }

    async saveView(text, view) {
        return await FrontHostApp.doHttpRequest({
            controller: 'Application',
            action    : 'saveView',
            params    : {
                app : this.getName(),
                view: view,
                text: text
            }
        });
    }

    async saveController(text) {
        return await FrontHostApp.doHttpRequest({
            controller: 'Application',
            action    : 'saveController',
            params    : {
                app : this.getName(),
                text: text
            }
        });
    }

    async createView() {
        return await FrontHostApp.doHttpRequest({
            controller: 'Application',
            action    : 'createView',
            params    : {
                app: this.getName()
            }
        });
    }

    async createController() {
        return await FrontHostApp.doHttpRequest({
            controller: 'Application',
            action    : 'createController',
            params    : {
                app: this.getName()
            }
        });
    }

    async createModelBackJs() {
        return await FrontHostApp.doHttpRequest({
            controller: 'Application',
            action    : 'createModelBackJs',
            params    : {
                app: this.getName()
            }
        });
    }

    async newDataSource(params) {
        const data = await FrontHostApp.doHttpRequest({
            controller: 'DataSource',
            action    : '_new',
            params    : params
        });
        return this.createDataSource(data);
    }

    async newAction(params) {
        // params['pageFileName'] = this.page.pageLink.getFileName();
        // params['form']         = this.getName();
        const data = await FrontHostApp.doHttpRequest({
            controller: 'Action',
            action    : '_new',
            params    : params
        });
        return this.createAction(data);
    }

}
