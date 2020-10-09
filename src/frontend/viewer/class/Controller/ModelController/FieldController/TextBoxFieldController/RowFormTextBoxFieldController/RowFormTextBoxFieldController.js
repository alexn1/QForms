'use strict';
class RowFormTextBoxFieldController extends RowFormFieldController {
    constructor(model, parent) {
        super(model, parent);
        this.textBox = null;
    }
    // fill(row) {
    //     console.log('RowFormTextBoxFieldController.fill', this.model.getFullName());
    //     /*const value = this.model.getValue(row);
    //     this.isUndefined = value === undefined;
    //     const stringValue = this.valueToString(value);
    //     this.state.value = stringValue;
    //     this.textBox = ApplicationController.createReactComponent(view, TextBox, {
    //         readOnly   : this.isReadOnly(),
    //         value      : stringValue,
    //         placeholder: this.getPlaceHolder(value),
    //         onChange: e => {
    //             // console.log('TextBox.onChange');
    //             this.onChange(view);
    //         }
    //     });*/
    //     // this.setViewStyle(view, row);
    // }
    isReadOnly() {
        return this.model.data.readOnly === 'true';
    }
    deinit(row, view) {
        // ReactDOM.unmountComponentAtNode(view);
        super.deinit(row, view);
    }
    setStringValue(stringValue, view) {
        throw new Error('not implemented');
        // this.textBox.setValue(stringValue);
    }
    getStringValue(view) {
        // return this.textBox.getValue();
        return this.state.value;
    }

    getPlaceHolder(value) {
        // console.log('TextBoxFieldController.getPlaceHolder', this.model.getFullName(), value);
        if (ApplicationController.isInDebugMode()) {
            if (value === undefined) {
                return 'undefined';
            } else if (value === null) {
                return 'null';
            } else if (value === '') {
                return 'empty string';
            }
        }
    }


}
