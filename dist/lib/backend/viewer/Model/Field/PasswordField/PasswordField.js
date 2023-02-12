"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BkPasswordField = void 0;
const Field_1 = require("../Field");
class BkPasswordField extends Field_1.Field {
    fillAttributes(response) {
        super.fillAttributes(response);
        response.readOnly = this.getAttr('readOnly');
        response.notNull = this.getAttr('notNull');
        response.placeholder = this.getAttr('placeholder');
        response.validateOnChange = this.getAttr('validateOnChange');
        response.validateOnBlur = this.getAttr('validateOnBlur');
        response.autocomplete = this.getAttr('autocomplete');
    }
}
exports.BkPasswordField = BkPasswordField;
