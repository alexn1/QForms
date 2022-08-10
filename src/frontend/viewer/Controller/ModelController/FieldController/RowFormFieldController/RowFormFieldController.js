class RowFormFieldController extends FieldController {
    constructor(model, parent) {
        super(model, parent);
        this.state = {
            value     : null,
            parseError: null,
            error     : null,
            changed   : false,
        };
    }
    init() {
        const row = this.getRow();
        const value = this.model.getValue(row);
        this.setValue(value);
        // console.log(this.model.getFullName(), value);
    }
    refill() {
        // console.log('RowFormFieldController.refill', this.model.getFullName());
        if (!this.view) return;
        const value = this.model.getValue(this.getRow());
        this.setValue(value);
        this.resetErrors();
        this.refreshChangedState();
    }
    getRow() {
        return this.model.getForm().getRow();
    }
    copyValueToModel() {
        // console.log('RowFormFieldController.copyValueToModel', this.model.getFullName());
        this.getModel().setValue(this.getRow(), this.getValue());
    }
    /*_onChange(widgetValue) {

    }*/
    putValue(widgetValue) {
        // console.log('RowFormFieldController.putValue', widgetValue);
        this.onChange(widgetValue, false);
    }
    onChange = async (widgetValue, fireEvent = true) => {
        console.log('RowFormFieldController.onChange', JSON.stringify(widgetValue));
        // this._onChange(widgetValue);

        this.resetErrors();
        this.rerender();

        // get value from widget
        try {
            this.setValueFromWidget(widgetValue);
        } catch (err) {
            console.error(`${this.model.getFullName()}: cannot parse view value: ${err.message}`);
            this.state.parseError = err.message;
        }

        // validate
        if (!this.state.parseError && this.isValidateOnChange()) {
            this.validate();
            if (this.isValid()) {
                this.copyValueToModel();
            }
        }

        // changed
        this.refreshChangedState();

        // event
        if (fireEvent) {
            try {
                this.emit('change', {value: widgetValue});
            } catch (err) {
                console.error('unhandled change event error:', this.model.getFullName(), err);
            }
            this.parent.onFieldChange({source: this});
        }
    }
    onBlur = (widgetValue, fireEvent = true) => {
        console.log('RowFormFieldController.onBlur', this.model.getFullName(), JSON.stringify(widgetValue));
        if (!this.isEditable()) return;

        // this.resetErrors();
        this.rerender();    // to clear field focus class

        if (!this.isValidateOnBlur()) return;

        // get value from widget
        try {
            this.setValueFromWidget(widgetValue);
        } catch (err) {
            console.error(`${this.model.getFullName()}: cannot parse view value: ${err.message}`);
            this.state.parseError = err.message;
        }

        // validate
        if (!this.state.parseError && this.isValidateOnBlur()) {
            this.validate();
            if (this.isValid()) {
                this.copyValueToModel();
            }
        }

        // changed
        this.refreshChangedState();

        // event
        if (fireEvent) {
            try {
                this.emit('change', {value: widgetValue});
            } catch (err) {
                console.error('unhandled change event error:', this.model.getFullName(), err);
            }
            this.parent.onFieldChange({source: this});
        }
    }
    getValueForWidget() {
        const value = this.getValue();
        // console.log('value:', this.model.getFullName(), value, typeof value);
        return this.valueToString(value);
    }
    setValueFromWidget(widgetValue) {
        // console.log('RowFormFieldController.setValueFromWidget', this.model.getFullName(), typeof widgetValue, widgetValue);
        if (typeof widgetValue !== 'string') throw new Error(`${this.model.getFullName()}: widgetValue must be string, but got ${typeof widgetValue}`);
        const value = this.stringToValue(widgetValue);
        // console.log('value:', value);
        this.setValue(value);
    }
    setValue(value) {
        // console.log('RowFormFieldController.setValue', this.model.getFullName(), value);
        this.state.value = value;
    }
    getValue() {
        return this.state.value;
    }
    isChanged() {
        // console.log('RowFormFieldController.isChanged', this.model.getFullName(), this.state);
        return this.state.changed;
    }
    isValid() {
        return this.state.parseError === null && this.state.error === null;
    }
    validate() {
        // console.log('RowFormFieldController.validate', this.model.getFullName());
        if (this.isVisible()) {
            this.state.error = this.getError();
        }
    }
    refreshChangedState() {
        this.state.changed = this.calcChangedState(this.getRow());
    }
    getPlaceholder() {
        // console.log('RowFormFieldController.getPlaceholder', this.model.getFullName(), this.model.getAttr('placeholder'));
        if (this.model.getAttr('placeholder')) return this.model.getAttr('placeholder');
        if (ApplicationController.isDebugMode()) {
            const value = this.getValue();
            if (value === undefined) return 'undefined';
            if (value === null) return 'null';
            if (value === '') return 'empty string';
        }
    }
    getError() {
        // console.log('RowFormFieldController.getError', this.model.getFullName());

        // parse validator
        if (this.view && this.view.getWidget()) {
            try {
                const widgetValue = this.view.getWidget().getValue();
            } catch (err) {
                return `can't parse value: ${err.message}`;
            }
        }

        // null validator
        const value = this.getValue();
        if (this.getModel().isNotNull() && (value === null || value === undefined)) {
            return this.getNullErrorText();
        }

        return null;
    }
    getNullErrorText() {
        return this.getModel().getApp().getText().form.required;
    }
    isEditable() {
        return this.parent.getMode() === 'edit' && !this.model.isReadOnly();
    }
    isParseError() {
        return this.state.parseError !== null;
    }
    calcChangedState(row) {
        // console.log('RowFormFieldController.calcChangedState', this.model.getFullName());
        if (!row) throw new Error('FieldController: no row');
        if (this.isParseError()) {
            console.log(`FIELD CHANGED ${this.model.getFullName()}: parse error: ${this.getErrorMessage()}`);
            return true;
        }
        if (!this.isValid()) {
            console.log(`FIELD CHANGED ${this.model.getFullName()}: not valid: ${this.getErrorMessage()}`);
            return true;
        }
        if (this.model.hasColumn()) {
            const fieldRawValue = this.model.valueToRaw(this.getValue());
            const dsRawValue = this.model.getRawValue(row);
            if (fieldRawValue !== dsRawValue) {
                console.log(`FIELD CHANGED ${this.model.getFullName()}`, JSON.stringify(dsRawValue), JSON.stringify(fieldRawValue));
                return true;
            }
        }
        if (this.model.isChanged(row)) {
            let original = row[this.model.getAttr('column')];
            let modified = this.model.getDefaultDataSource().getRowWithChanges(row)[this.model.getAttr('column')];
            if (original) original = original.substr(0, 100);
            if (modified) modified = modified.substr(0, 100);
            console.log(`MODEL CHANGED ${this.model.getFullName()}:`, original, modified);
            return true;
        }
        return false;
    }
    setError(error) {
        this.state.error = error;
    }
    resetErrors() {
        this.setError(null);
        this.state.parseError = null;
    }
    getErrorMessage() {
        if (this.state.parseError) {
            return this.state.parseError;
        }
        return this.state.error;
    }
    renderView() {
        return React.createElement(this.getViewClass(), {
            onCreate: this.onViewCreate,
            ctrl: this,
        });
    }
    isValidateOnChange() {
        return this.getModel().validateOnChange();
    }
    isValidateOnBlur() {
        return this.getModel().validateOnBlur();
    }
    onChangePure = async (value, fireEvent = true) => {
        console.log('RowFormFieldController.onChangePure', JSON.stringify(value));

        // value
        this.setValue(value);
        this.resetErrors();
        this.rerender();

        // validate
        if (this.isValidateOnChange()) {
            this.validate();
            if (this.isValid()) {
                this.copyValueToModel();
            }
        }

        // changed
        this.refreshChangedState();

        // event
        if (fireEvent) {
            try {
                this.emit('change', {value});
            } catch (err) {
                console.error('unhandled change event error:', this.getModel().getFullName(), err);
            }
            this.parent.onFieldChange({source: this});
        }
    }
}
window.QForms.RowFormFieldController = RowFormFieldController;
