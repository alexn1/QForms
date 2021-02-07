class Application extends Model {

    constructor(data) {
        super(data);
        this.databases   = [];
        this.dataSources = [];
        this.pageLinks   = [];
    }

    init() {
        // databases
        for (const name in this.data.databases) {
            this.createDatabase(this.data.databases[name]);
        }

        // dataSources
        for (const name in this.data.dataSources) {
            this.createDataSource(this.data.dataSources[name]);
        }

        // pageLinks
        for (const name in this.data.pageLinks) {
            this.createPageLink(this.data.pageLinks[name]);
        }
    }

    createDatabase(data) {
        const database = new Database(data, this);
        database.init();
        this.databases.push(database);
        return database;
    }
    createDataSource(data) {
        const dataSource = new DataSource(data, this);
        dataSource.init();
        this.dataSources.push(dataSource);
        return dataSource;
    }
    createPageLink(data) {
        const pageLink = new PageLink(data, this);
        pageLink.init();
        this.pageLinks.push(pageLink);
        return pageLink;
    }
    removePageLink(pageLink) {
        console.log('Application.removePageLink', pageLink.getName());
        const i = this.pageLinks.indexOf(pageLink);
        if (i === -1) throw new Error('no such pageLink');
        this.pageLinks.splice(i, 1);
    }
    async setValue(name, value) {
        //console.log(name + ' = ' + value);
        const data = await QForms.doHttpRequest({
            controller: 'Application',
            action    : 'save',
            params    : Helper.encodeObject({
                attr : name,
                value: value
            })
        });
        this.data['@attributes'][name] = value;
        return data;
    }

    async newPageAndPageLinkData(params) {
        params['menu'] = (params['startup'] === 'true') ? 'Pages' : '';
        return await QForms.doHttpRequest({
            controller: 'Page',
            action    : '_new',
            params    : Helper.encodeObject(params)
        });
    }

    async newPage(params) {
        const {page: pageData, pageLink: pageLinkData} = await this.newPageAndPageLinkData(params);
        const pageLink = this.createPageLink(pageLinkData);
        return new Page(pageData, pageLink);
    }

    async newDatabase(params) {
        const data = await QForms.doHttpRequest({
            controller: 'Database',
            action    : '_new',
            params    : Helper.encodeObject(params)
        });
        return this.createDatabase(data);
    }

    async getView(view) {
        return await QForms.doHttpRequest({
            controller: 'Application',
            action    : 'getView',
            params    : Helper.encodeObject({
                app : this.data['@attributes'].name,
                view: view
            })
        });
    }

    async saveView(text, view) {
        return await QForms.doHttpRequest({
            controller: 'Application',
            action    : 'saveView',
            params    : Helper.encodeObject({
                app : this.data['@attributes'].name,
                view: view,
                text: text
            })
        });
    }

    async saveController(text) {
        return await QForms.doHttpRequest({
            controller: 'Application',
            action    : 'saveController',
            params    : Helper.encodeObject({
                app : this.data['@attributes'].name,
                text: text
            })
        });
    }

    async createView() {
        return await QForms.doHttpRequest({
            controller: 'Application',
            action    : 'createView',
            params    : Helper.encodeObject({
                app: this.data['@attributes'].name
            })
        });
    }

    async createController() {
        return await QForms.doHttpRequest({
            controller: 'Application',
            action    : 'createController',
            params    : Helper.encodeObject({
                app: this.data['@attributes'].name
            })
        });
    }

    async newDataSource(params) {
        return await QForms.doHttpRequest({
            controller: 'DataSource',
            action    : '_new',
            params    : Helper.encodeObject(params)
        });
    }

}
