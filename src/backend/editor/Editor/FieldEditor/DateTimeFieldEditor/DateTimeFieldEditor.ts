import { FieldEditor } from '../FieldEditor';

export class DateTimeFieldEditor extends FieldEditor {
    static createData(params) {
        return {
            '@class': 'DateTimeField',
            '@attributes': {
                ...FieldEditor.createAttributes(params),
                readOnly: params.readOnly ? params.readOnly : 'false',
                notNull: params.notNull ? params.notNull : 'false',
                format: params.format ? params.format : '{DD}.{MM}.{YYYY}',
                timezone: params.timezone ? params.timezone : 'true',
                placeholder: params.placeholder ? params.placeholder : '',
                validateOnChange: params.validateOnChange ? params.validateOnChange : 'true',
                validateOnBlur: params.validateOnBlur ? params.validateOnBlur : 'false',
            },
        };
    }
}
