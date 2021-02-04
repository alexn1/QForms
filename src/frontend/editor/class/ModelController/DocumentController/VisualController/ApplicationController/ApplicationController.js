class ApplicationController extends VisualController {

    constructor(model, editorController) {
        super(model);
        this.editorController = editorController;
        this.item = null;
        this.databasesItem = null;
        this.dataSourcesItem = null;
        this.pagesItem = null;
        this.pageItems = {};

        this.databases   = [];
        this.dataSources = [];
        this.pageLinks   = [];

        // items
        this.opened = true;
        this.items = [
            {
                getTitle: () => 'Databases',
                items: this.databases
            },
            {
                getTitle: () => 'Data Sources',
                items: this.dataSources
            },
            {
                getTitle: () => 'Pages',
                items: this.pageLinks,
                opened: true
            }
        ];
    }
    init() {
        this.model.databases.forEach(database => this.createDatabase(database));
        this.model.dataSources.forEach(dataSource => this.createDataSource(dataSource));
        this.model.pageLinks.forEach(pageLink => this.createPageLink(pageLink));
    }

    createDatabase(model) {
        const database = new DatabaseController(model, this);
        database.init();
        this.databases.push(database);
    }
    createDataSource(model) {
        const dataSource = new DataSourceController(model);
        dataSource.init();
        this.dataSources.push(dataSource);
    }
    createPageLink(model) {
        const pageLink = new PageLinkController(model);
        pageLink.init();
        this.pageLinks.push(pageLink);
        return pageLink;
    }
    createTree(item) {
        this.item = item;

        // databases
        this.databasesItem = this.item.addItem('Databases');
        this.databases.forEach(database => this.addDatabaseItem(database));

        // data sources
        this.dataSourcesItem = this.item.addItem('Data Sources');
        this.dataSources.forEach(dataSource => this.addDataSourceItem(dataSource));

        // pageLinks
        this.pagesItem = this.item.addItem('Pages', 'opened');
        this.pageLinks.forEach(pageLink => this.addPageLinkItem(pageLink));
    }

    addDatabaseItem(database) {
        const caption = `${database.model.getClassName()}: ${database.model.getName()}`;
        const databaseItem = this.databasesItem.addItem(caption);
        databaseItem.ctrl = database;
        databaseItem.ctrl.createTree(databaseItem);
        return databaseItem;
    }

    addDataSourceItem(dataSource) {
        const caption = `${dataSource.model.getClassName()}: ${dataSource.model.getName()}`;
        const dataSourceItem = this.dataSourcesItem.addItem(caption);
        dataSourceItem.ctrl = dataSource;
        dataSourceItem.ctrl.createTree(dataSourceItem);
        return dataSourceItem;
    }

    addPageLinkItem(pageLink) {
        const pageLinkItem = this.pagesItem.addItem(pageLink.model.getName());
        pageLinkItem.node.className = 'node';
        pageLinkItem.ctrl = pageLink;
        return pageLinkItem;
    }

    addPageItem(pageController) {


        // pageItem
        const pageItem = this.pagesItem.addItem(pageController.getTitle());
        pageItem.ctrl = pageController;
        pageItem.node.className = 'node';
        pageItem.ctrl.createTree(pageItem);
        return pageItem;
    }

    getActions() {
        return [
            {'action': 'newDatabase'  , 'caption': 'New Database'   },
            {'action': 'newDataSource', 'caption': 'New Data Source'},
            {'action': 'newPage'      , 'caption': 'New Page'       }
        ];
    }

    doAction(action) {
        switch (action) {
            case 'newDatabase':
                this.newDatabaseAction();
                break;
            case 'newDataSource':
                this.newDataSourceAction();
                break;
            case 'newPage':
                this.newPageAction();
                break;
            default:
                console.log(action);
        }
    }

    async newPageAction() {
        const result = await Page.prototype.getView('new.html');
        $(document.body).append(result.view);
        $('#myModal').on('hidden.bs.modal', function(e){$(this).remove();});
        $("#myModal button[name='create']").click(async () => {
            const name    = $("#myModal input[id='name']").val();
            const caption = $("#myModal input[id='caption']").val();
            const startup = $("#myModal select[id='startup']").val();
            const params = {
                name   : name,
                caption: caption,
                startup: startup
            };
            const page = await this.model.newPage(params);
            this.createPageLink(page.pageLink);


            const pageController = new PageController(page);
            pageController.init();

            this.pageItems[name] = this.addPageItem(pageController);
            this.pageItems[name].select();
            $('#myModal').modal('hide');
            this.editorController.treeWidget2.rerender();
        });
        $('#myModal').modal('show');
        $("#myModal input[id='name']").focus();
    }

    async newDataSourceAction() {
        const self = this;
        const result = await DataSource.prototype.getView('new.html');
        $(document.body).append(result.view);
        $('#myModal').on('hidden.bs.modal', function(e){$(this).remove();});
        $("#myModal button[name='create']").click(function() {
            const dsName = $("#myModal input[id='dsName']").val();
            const dsClass = $("#myModal select[id='dsClass']").val();
            const params = {
                name :dsName,
                class:dsClass
            };
            self.model.newDataSource(params).then((dataSourceData) => {
                self.addDataSourceItem(dataSourceData).select();
            });
            $('#myModal').modal('hide');
        });
        $('#myModal').modal('show');
        $("#myModal input[id='dsName']").focus();
    }

    async newDatabaseAction() {
        const self = this;
        const result = await Database.prototype.getView('new.html');
        $(document.body).append(result.view);
        $('#myModal').on('hidden.bs.modal', function(e){$(this).remove();});
        $("#myModal button[name='create']").click(async () => {
            const _class = $("#myModal select[id='class']").val();
            const name     = $("#myModal input[id='name']").val();
            const host     = $("#myModal input[id='host']").val();
            const dbname   = $("#myModal input[id='dbname']").val();
            const user     = $("#myModal input[id='user']").val();
            const password = $("#myModal input[id='password']").val();
            const params = {
                _class: _class,
                name  : name,
                params: {
                    host    : {name: 'host'    , value: host    },
                    database: {name: 'database', value: dbname  },
                    user    : {name: 'user'    , value: user    },
                    password: {name: 'password', value: password}
                }
            };
            // console.log('params:', params);
            const databaseData = await self.model.newDatabase(params);
            self.addDatabaseItem(databaseData).select();
            $('#myModal').modal('hide');
        });
        $('#myModal').modal('show');
        $("#myModal input[id='name']").focus();
    }

    getPropList() {
        const propList = super.getPropList();
        propList.options['authentication'] = ['true', 'false'];
        propList.options['lang']           = ['en'  , 'ru'   ];
        return propList;
    }

}
