declare const FieldEditor: any;
declare class CheckBoxListFieldEditor extends FieldEditor {
    static createData(params: any): {
        '@class': string;
        '@attributes': any;
    };
}
export = CheckBoxListFieldEditor;
