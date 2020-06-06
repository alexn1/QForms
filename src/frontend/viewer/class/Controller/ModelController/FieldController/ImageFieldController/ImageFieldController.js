'use strict';

class ImageFieldController extends FieldController {

    constructor(model, parent) {
        super(model, parent);
    }

    getValue(view) {
        switch (this.model.form.data.class) {
            case 'RowForm':
                return view.firstElementChild.src;
            case 'TableForm':
                return view.firstElementChild.innerHTML;
        }
    }

    setValue(value, view) {
        switch (this.model.form.data.class) {
            case 'RowForm':
                if (value !== '') {
                    view.firstElementChild.src = this.model.data.defaultValue + value;
                }
                break;
            case 'TableForm':
                if (value !== '') {
                    view.firstElementChild.innerHTML = value;
                }
                break;
        }
    }

}