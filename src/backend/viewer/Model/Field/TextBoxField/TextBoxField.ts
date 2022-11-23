import {Field} from '../Field';

export class TextBoxField extends Field {
    fillAttributes(response: any): void {
        super.fillAttributes(response);
        response.readOnly         = this.getAttr('readOnly');
        response.notNull          = this.getAttr('notNull');
        response.placeholder      = this.getAttr('placeholder');
        response.validateOnChange = this.getAttr('validateOnChange');
        response.validateOnBlur   = this.getAttr('validateOnBlur');
        response.autocomplete     = this.getAttr('autocomplete');
    }
}
