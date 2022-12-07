import { FieldEditor } from '../FieldEditor';

export class PhoneFieldEditor extends FieldEditor {
    static createData(params) {
        return {
            '@class': 'PhoneField',
            '@attributes': {
                ...FieldEditor.createAttributes(params),
                readOnly: params.readOnly ? params.readOnly : 'false',
                notNull: params.notNull ? params.notNull : 'false',
                placeholder: params.placeholder ? params.placeholder : '',
                validateOnChange: params.validateOnChange ? params.validateOnChange : 'true',
                validateOnBlur: params.validateOnBlur ? params.validateOnBlur : 'false',
                autocomplete: params.autocomplete ? params.autocomplete : '',
            },
        };
    }
}
