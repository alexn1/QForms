import Form = require('../Form');
declare class RowForm extends Form {
    isNewMode(context: any): boolean;
    fillAttributes(response: any): void;
}
export = RowForm;
