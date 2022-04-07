"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Field_1 = __importDefault(require("../Field"));
const Helper = require('../../../../Helper');
class DateField extends Field_1.default {
    fillAttributes(response) {
        super.fillAttributes(response);
        response.readOnly = this.getAttr('readOnly');
        response.notNull = this.getAttr('notNull');
        response.format = this.getAttr('format');
        // if (this.isAttr('timezone')) {
        response.timezone = this.getAttr('timezone');
        // }
        response.placeholder = this.getAttr('placeholder');
        response.validateOnChange = this.getAttr('validateOnChange');
        response.validateOnBlur = this.getAttr('validateOnBlur');
    }
    valueToRaw(value) {
        let raw;
        if (value && !this.isTimezone()) {
            const v = Helper.cloneDate(value);
            Helper.removeTimezoneOffset(v);
            raw = Helper.encodeValue(v);
        }
        else {
            raw = Helper.encodeValue(value);
        }
        // console.log('DateField.valueToRaw', this.getFullName(), value, raw);
        return raw;
    }
    rawToValue(raw) {
        const value = Helper.decodeValue(raw);
        if (value && !this.isTimezone()) {
            Helper.addTimezoneOffset(value);
        }
        // console.log('DateField.rawToValue', this.getFullName(), raw, value);
        return value;
    }
}
module.exports = DateField;
