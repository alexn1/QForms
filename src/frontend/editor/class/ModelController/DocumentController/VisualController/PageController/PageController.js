class PageController extends VisualController {

    constructor(model, pageLinkController = null) {
        super(model);
        this.pageLinkController = pageLinkController;
        this.item      = null;
        this.itemForms = null;
        this.dataSources = [];
        this.forms       = [];
        this.items = [
            {getTitle: () => 'Data Sources', items: this.dataSources},
            {getTitle: () => 'Forms'       , items: this.forms}
        ];
    }

    init() {
        // console.log('PageController.init');

        // dataSources
        this.model.dataSources.forEach(dataSource => this.createDataSource(dataSource));

        // forms
        this.model.forms.forEach(form => this.createForm(form));
    }

    createDataSource(model) {
        const dataSource = new DataSourceController(model);
        dataSource.init();
        this.dataSources.push(dataSource);
    }

    createForm(model) {
        const form = new FormController(model);
        form.init();
        this.forms.push(form);
    }

    /*createTree(item) {
        if (item) this.item = item;

        // data sources
        this.dataSourcesItem = this.item.addItem('Data Sources');
        this.dataSources.forEach(dataSource => this.addDataSourceItem(dataSource));

        // forms
        this.itemForms = this.item.addItem('Forms');
        this.forms.forEach(form => this.addFormItem(form));
    }*/

    /*addDataSourceItem(dataSource) {
        const dataSourceItem = this.dataSourcesItem.addItem(dataSource.model.getName());
        dataSourceItem.ctrl = dataSource;
        dataSourceItem.ctrl.createTree(dataSourceItem);
        return dataSourceItem;
    }*/

    /*addFormItem(form) {
        const caption = `${form.model.getClassName()}: ${form.model.getName()}`;
        const itemForm = this.itemForms.addItem(caption);
        itemForm.ctrl = form;
        itemForm.ctrl.createTree(itemForm);
        return itemForm;
    }*/

    getActions() {
        return [
            {'action': 'newDataSource', 'caption': 'New Data Source'},
            {'action': 'newForm'      , 'caption': 'New Form'       },
            {'action': ''             , 'caption': '-'              },
            {'action': 'moveUp'       , 'caption': 'Move Up'        },
            {'action': 'moveDown'     , 'caption': 'Move Down'      },
            {'action': ''             , 'caption': '-'              },
            {'action': 'delete'       , 'caption': 'Delete'         }
        ];
    }

    async doAction(action) {
        switch (action) {
            case 'newForm':
                this.actionNewForm();
                break;
            case 'newDataSource':
                this.newDataSourceAction();
                break;
            case 'delete':
                this.delete();
                break;
            case 'moveUp':
                await this.model.pageLink.moveUp();
                this.item.move(-1);
                break;
            case 'moveDown':
                await this.model.pageLink.moveDown();
                this.item.move(1);
                break;
            default:
                console.log(action);
        }
    }

    async delete() {
        await this.model.delete();
        this.pageLinkController.parent.removePageLink(this.pageLinkController);
        this.item.parent.removeItem(this.item);


        this.pageLinkController.parent.editorController.treeWidget2.rerender();

    }

    async actionNewForm() {
        const self = this;
        const result = await Form.prototype.getView('new.html');
        $(document.body).append(result.view);
        $('#myModal').on('hidden.bs.modal', function(e){$(this).remove();});
        $("#myModal button[name='create']").click(function() {
            const params = {
                name:$("#myModal input[id='name']").val(),
                caption:$("#myModal input[id='caption']").val(),
                class:$("#myModal select[id='formClass']").val()
            };
            self.model.newForm(params).then((formData) => {
                self.addFormItem(formData).select();
                $('#myModal').modal('hide');
            });
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
            DataSource.create(self.model, params).then((dataSourceData) => {
                self.addDataSourceItem(dataSourceData).select();
            });
            $('#myModal').modal('hide');
        });
        $('#myModal').modal('show');
        $("#myModal input[id='dsName']").focus();
    }

    getPropList() {
        const propList = super.getPropList();
        propList.list['menu']    = this.getPageLink().data['@attributes']['menu'];
        propList.list['startup'] = this.getPageLink().data['@attributes']['startup'];
        propList.options['startup'] = ['true', 'false'];
        return propList;
    }

    setProperty(name, value) {
        if (name === 'startup' || name === 'menu') {
            this.getPageLink().setValue(name, value);
        } else  {
            ModelController.prototype.setProperty.call(this, name, value);
        }
    }

    getPageLink() {
        return this.model.pageLink;
    }

}
