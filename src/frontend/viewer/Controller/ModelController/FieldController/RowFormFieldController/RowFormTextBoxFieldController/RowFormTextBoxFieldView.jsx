class RowFormTextBoxFieldView extends RowFormFieldView {
    constructor(props) {
        super(props);
        this.state = {
            classList: []
        };
    }
    onCloseClick = async e => {
        // console.log('RowFormTextBoxFieldView.onCloseClick');
        const ctrl = this.props.ctrl;
        this.getWidget().state.value = '';
        this.getWidget().setState({value: ''});
        ctrl.onChange('');
        this.getWidget().getElement().focus();
    }
    isCloseVisible() {
        // console.log('RowFormTextBoxFieldView.isCloseVisible', this.props.value);
        const ctrl = this.props.ctrl;
        if (!ctrl.isEditable()) return false;
        if (!this.getWidget()) {
            return this.props.value !== undefined;
        }
        // console.log('this.getWidget().state.value:', this.getWidget().state.value);
        return this.getWidget().state.value !== '';
    }
    onFocus = async e => {
        // console.log('RowFormTextBoxFieldView.onFocus');
        this.addCssClass('focus');
        await this.rerender();
    }
    onBlur = async e => {
        // console.log('RowFormTextBoxFieldView.onBlur');
        this.removeCssClass('focus');
        await this.rerender();
    }
    renderTextBox() {
        const ctrl = this.props.ctrl;
        return <TextBox
            classList={[`${this.getCssBlockName()}__input`]}
            value={ctrl.getValueForWidget()}
            readOnly={!ctrl.isEditable()}
            disabled={!ctrl.isEditable()}
            autoFocus={ctrl.isAutoFocus()}
            placeholder={ctrl.getPlaceholder() || null}
            autocomplete={ctrl.getAutocomplete()}
            onCreate={this.onWidgetCreate}
            onChange={ctrl.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
        />;
    }
    renderCloseIcon() {
        return <div className={`${this.getCssBlockName()}__close ${this.isCloseVisible() ? 'visible' : ''}`}
             onClick={this.onCloseClick}
        >
            <CloseIcon/>
        </div>;
    }
    render() {
        return <div className={this.getCssClassNames()}>
            {this.renderTextBox()}
            {this.renderCloseIcon()}
        </div>;
    }
}
window.QForms.RowFormTextBoxFieldView = RowFormTextBoxFieldView;
