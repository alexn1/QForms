class ApplicationView extends ReactComponent {
    getTabs() {
        const ctrl = this.props.ctrl;
        return ctrl.pages.map(pageCtrl => {
            return {
                name   : pageCtrl.model.getName(),
                title  : pageCtrl.model.getCaption(),
                content: <PageView ctrl={pageCtrl}/>
            };
        });
    }
    render() {
        console.log('ApplicationView.render', this.props.ctrl.model.getFullName());
        const ctrl = this.props.ctrl;
        const model = ctrl.model;
        return (
            <div className={`ApplicationView ${model.data.theme}`}>
                <Menu items={ctrl.getMenuItemsProp()} onClick={ctrl.onMenuItemClick}/>
                <Tab tabs={this.getTabs()} canClose={true} onTabClose={ctrl.onPageClose}/>
                <Statusbar/>
            </div>
        );
    }
}
