"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioField = void 0;
const Field_1 = require("../Field");
class RadioField extends Field_1.Field {
    fillAttributes(response) {
        super.fillAttributes(response);
        response.readOnly = this.getAttr('readOnly');
        response.notNull = this.getAttr('notNull');
        response.dataSourceName = this.getAttr('dataSourceName');
        response.valueColumn = this.getAttr('valueColumn');
        response.displayColumn = this.getAttr('displayColumn');
    }
}
exports.RadioField = RadioField;
