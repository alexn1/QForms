class RowFormImageFieldView extends RowFormFieldView {
    render() {
        const ctrl = this.props.ctrl;
        return <div className={this.getClassName()} style={ctrl.renderViewStyle(ctrl.getRow())}>
            <Image src={ctrl.renderValueForView()}/>
        </div>;
    }
}
