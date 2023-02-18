"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BkComboBoxField = void 0;
const Field_1 = require("../Field");
class BkComboBoxField extends Field_1.BkField {
    fillAttributes(response) {
        super.fillAttributes(response);
        response.readOnly = this.getAttr('readOnly');
        response.notNull = this.getAttr('notNull');
        response.placeholder = this.getAttr('placeholder');
        response.dataSourceName = this.getAttr('dataSourceName');
        response.valueColumn = this.getAttr('valueColumn');
        response.displayColumn = this.getAttr('displayColumn');
        response.newRowMode = this.getAttr('newRowMode');
        response.itemEditPage = this.getAttr('itemEditPage');
        response.itemCreatePage = this.getAttr('itemCreatePage');
        response.itemCreateForm = this.getAttr('itemCreateForm');
        response.itemSelectPage = this.getAttr('itemSelectPage');
    }
}
exports.BkComboBoxField = BkComboBoxField;
