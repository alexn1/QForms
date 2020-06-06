'use strict';

class TextAreaFieldController extends FieldController {

    constructor(model, parent) {
        super(model, parent);
    }

    fill(row, view) {
        super.fill(row, view);
        const self = this;
        if (this.model.form.data.class === 'RowForm') {
            $(view).children().on('input', function() {
                self.onChange(this);
            });
        }
    }

    // isValid(view) {
    //     let isValid = true;
    //     if (this.model.data.notNull === 'true') {
    //         isValid = view.firstElementChild.value !== undefined && view.firstElementChild.value !== null && view.firstElementChild.value !== '';
    //     }
    //     if (!isValid) {
    //         view.firstElementChild.classList.add('error');
    //     } else {
    //         view.firstElementChild.classList.remove('error');
    //     }
    //     return isValid;
    // }
}
