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
        const database = new Database(data);
        database.init();
        this.databases.push(database);
    }
    createDataSource(data) {
        const dataSource = new DataSource(data);
        dataSource.init();
        this.dataSources.push(dataSource);
    }
    createPageLink(data) {
        const pageLink = new PageLink(data, this);
        pageLink.init();
        this.pageLinks.push(pageLink);
        return pageLink;
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

    async newPage(params) {
        params['menu'] = (params['startup'] === 'true') ? 'Pages' : '';
        const data = await QForms.doHttpRequest({
            controller: 'Page',
            action    : '_new',
            params    : Helper.encodeObject(params)
        });
        const pageLink = this.createPageLink(data.pageLink);
        return new Page(data.page, this, pageLink);
    }

    async newDatabase(params) {
        const data = await QForms.doHttpRequest({
            controller: 'Database',
            action    : '_new',
            params    : Helper.encodeObject(params)
        });
        return data;
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
