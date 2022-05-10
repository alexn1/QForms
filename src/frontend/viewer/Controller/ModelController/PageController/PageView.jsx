class PageView extends ModelView {
    constructor(props) {
        super(props);
        this.checkParent();
        this.el = React.createRef();
    }
    onActionsClick = async li => {
        // console.log('PageView.onActionsClick:', li);
        const ctrl = this.getCtrl();
        const name = li.dataset.action;
        try {
            const result = await ctrl.onActionClick(name);
            if (!result) {
                throw new Error(`no handler for action '${name}'`);
            }
        } catch (err) {
            console.error(err);
            await this.getCtrl().getApp().alert({message: err.message});
        }
    }
    isToolbar() {
        const model = this.getCtrl().getModel();
        return model.options.selectMode
            || (model.isModal() && model.hasRowFormWithDefaultSqlDataSource())
            || model.hasActions();
    }
    getFormTabs(forms) {
        return forms.map(form => {
            return {
                name   : form.getModel().getName(),
                title  : form.getTitle(),
                content: this.renderForm(form)
            };
        });
    }
    getRowForms() {
        return this.getCtrl().forms.filter(form => form.getModel().getClassName() === 'RowForm');
    }
    getTableForms() {
        return this.getCtrl().forms.filter(form => form.getModel().getClassName() === 'TableForm');
    }
    renderForm(formCtrl, props = {}) {
        return React.createElement(formCtrl.getViewClass(), {
            parent  : this,
            key     : formCtrl.getModel().getName(),
            ctrl    : formCtrl,
            onCreate: formCtrl.onViewCreate,
            updated : formCtrl.getUpdated(),
            ...props
        });
    }
    renderRowForms() {
        return this.getRowForms().map(form => this.renderForm(form));
    }
    renderTitle() {
        const ctrl = this.getCtrl();
        const model = ctrl.getModel();
        return <h1 className={`${this.getCssBlockName()}__title`}>
            {ctrl.getTitle()}
            {model.hasRowFormWithDefaultSqlDataSource() && (ctrl.isChanged() || model.hasNew()) &&
                [' ', <span key={'star'} className={`${this.getCssBlockName()}__star`}>*</span>]
            }
        </h1>;
    }
    renderToolbar() {
        const ctrl = this.getCtrl();
        const model = ctrl.model;
        return (
            <div className={`${this.getCssBlockName()}__toolbar`}>
                {model.options.selectMode &&
                    <Button
                        classList={['toolbar-button', 'default']}
                        onClick={ctrl.onSelectClick}
                        enabled={!!ctrl.getSelectedRowKey()}
                    >
                        <DoneIcon/>
                        <div>{model.getApp().getText().page.select}</div>
                    </Button>
                }
                {/*{model.options.selectMode &&
                    <Button classList={['toolbar-button']}
                        title={model.getApp().getText().page.reset}
                            onClick={ctrl.onResetClick}
                    />
                }*/}
                {model.isModal() && model.hasRowFormWithDefaultSqlDataSource() &&
                    <Button
                        classList={['toolbar-button', 'default']}
                        onClick={ctrl.onSaveAndCloseClick}
                        enabled={ctrl.isValid() && (model.hasNew() || (ctrl.isChanged()))}
                    >
                        <DoneIcon/>
                        <div>{model.getApp().getText().page.saveAndClose}</div>
                    </Button>
                }
                {model.hasActions() &&
                    <DropdownButton
                        classList={['toolbar-dropdown-button']}
                        actions={this.getActionsForDropdownButton()}
                        onClick={this.onActionsClick}
                    >
                        <MoreVertIcon/>
                    </DropdownButton>
                }
            </div>
        );
    }
    /*shouldComponentUpdate(nextProps, nextState) {
        return false;
    }*/
    renderTableForms() {
        const tableForms = this.getTableForms();
        // if (tableForms.length === 1) {
        //     return this.renderForm(tableForms[0]);
        // } else {
            return <div className={`${this.getCssBlockName()}__table-forms flex-max frame`}>
                <div className="frame__container">
                    <Tab2 tabs={this.getFormTabs(tableForms)} classList={['Tab-blue', 'full']}/>
                </div>
            </div>;
        // }
    }

    renderOpenPageHeaderButton() {
        const ctrl = this.getCtrl();
        return <div key={'open'} className={`${this.getCssBlockName()}__open`} onClick={ctrl.onOpenPageClick}>
            <OpenInNewIcon/>
        </div>;
    }
    renderClosePageHeaderButton() {
        const ctrl = this.getCtrl();
        return <div key={'close'} className={`${this.getCssBlockName()}__close`} onClick={ctrl.onClosePageClick}>
            <CloseIcon2/>
        </div>;
    }
    renderHeader() {
        const model = this.getCtrl().getModel();
        return <div className={`${this.getCssBlockName()}__header`}>
            {this.renderTitle()}
            {model.isModal() &&
                [
                    ...(model.getKey() ? [this.renderOpenPageHeaderButton()] : []),
                    this.renderClosePageHeaderButton()
                ]
            }
        </div>;
    }
    renderMain() {
        return <div className={`${this.getCssBlockName()}__main flex-max frame`}>
            <div className="frame__container flex-column grid-gap-10">
                {this.isToolbar() && this.renderToolbar()}
                {this.renderForms()}
            </div>
        </div>;
    }
    renderForms() {
        const model = this.getCtrl().getModel();
        return [
            ...(model.hasRowForm() ? [this.renderRowForms()] : []),
            ...(model.hasTableForm() ? [this.renderTableForms()] : [])
        ];
    }
    renderForms2() {
        return <Tab2 tabs={this.getFormTabs(this.getCtrl().forms)} classList={['Tab-blue', 'full']}/>;
    }
    renderFooter() {
    }
    render() {
        console.log('PageView.render', this.getCtrl().getModel().getFullName());
        return <div ref={this.el}
                    tabIndex={0}
                    onKeyDown={this.getCtrl().onKeyDown}
                    className={`${this.getCssClassNames()} ${this.getCtrl().isModal() ? '' : 'full'} flex-column`}
                    style={this.getStyle()}
        >
            {this.renderHeader()}
            {this.renderMain()}
            {this.renderFooter()}
        </div>;
    }
    getStyle() {
        if (this.getCtrl().isModal()) {
            return {
                width: 1000,
                height: 750
            };
        }
    }
    componentDidMount() {
        // console.log('PageView.componentDidMount', this.getCtrl().getModel().getFullName());
        if (this.getCtrl().isAutoFocus() && !this.getCtrl().getModel().getKey()) {

        } else {
            this.focus();
        }
    }
    focus() {
        // console.log('PageView.focus', this.getCtrl().getModel().getFullName());
        if (this.getElement()) {
            // console.log('focus', this.getElement());
            this.getElement().focus();
        } else {
            console.error(`${this.getCtrl().getModel().getFullName()}: el is null (ref={this.el})`);
        }
    }
}
window.QForms.PageView = PageView;
